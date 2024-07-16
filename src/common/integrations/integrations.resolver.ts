import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IntegrationsService } from './integrations.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { User } from '../../auth/user.decorator';
import { UserEntity } from '../users/users.entity';
import { IntegrationsEntity } from './integrations.entity';
import { CompaniesService } from '../companies/companies.service';
import { IntegrationsSmsInput } from './dto/integrations.sms.input';
import { IntegrationsType } from './integrations.type';
import { IntegrationsTelegramInput } from './dto/integrations.telegram.input';
import { IntegrationsProviderType } from './integrations.provider.type';
import { Plans } from '../../auth/auth.plans.decorator';
import { PlanTypes } from '../users/users.plan.enum';
import { AuthPlansGuard } from '../../auth/auth.plans.guard';

@Resolver(() => IntegrationsResolver)
@Plans(PlanTypes.START, PlanTypes.MEDIUM, PlanTypes.PRO)
export class IntegrationsResolver {
	constructor(
		private integrationsService: IntegrationsService,
		private companyService: CompaniesService,
	) {}

	@Query(() => Boolean)
	async checkIntegration(
		@Args('type') type: IntegrationsType,
		@Args('company') company: string,
	) {
		const integration = await this.integrationsService.findOneBy({
			type,
			company: {
				hash: company,
			},
		});
		return !!integration?.id;
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => [IntegrationsEntity])
	async getAllIntegrations(
		@User() user: UserEntity,
		@Args('company') company: string,
	) {
		const builder = this.integrationsService.findWithQueryBuilder();
		builder
			.leftJoinAndSelect('e.company', 'company')
			.leftJoinAndSelect('company.users', 'users');
		builder
			.andWhere(`company.hash = '${company}'`)
			.andWhere(`users.id IN(${user.id})`);
		return await builder.getMany();
	}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Query(() => IntegrationsEntity, { nullable: true })
	async getIntegration(
		@User() user: UserEntity,
		@Args('type') type: IntegrationsType,
		@Args('company') company: string,
	) {
		return await this.integrationsService.findOneBy({
			type,
			company: {
				hash: company,
				users: {
					id: user.id,
				},
			},
		});
	}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Mutation(() => IntegrationsEntity)
	async connectTelegramIntegration(
		@User() user: UserEntity,
		@Args('company') hash: string,
		@Args('payload') payload: IntegrationsTelegramInput,
	) {
		const company = await this.companyService.findOneBy({
			hash,
			users: {
				id: user.id,
			},
		});
		if (company) {
			let integration = await this.integrationsService.findOneBy({
				type: IntegrationsType.TELEGRAM,
				company: {
					hash: company.hash,
				},
			});
			if (!integration) {
				integration = new IntegrationsEntity();
				integration.company = company;
				integration.type = IntegrationsType.TELEGRAM;
			}
			integration.provider = IntegrationsProviderType.BOT;
			integration.config = JSON.stringify(payload);
			return this.integrationsService.update(integration);
		}
	}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Mutation(() => IntegrationsEntity)
	async connectSMSIntegration(
		@User() user: UserEntity,
		@Args('company') hash: string,
		@Args('payload') payload: IntegrationsSmsInput,
	) {
		const company = await this.companyService.findOneBy({
			hash,
			users: {
				id: user.id,
			},
		});
		if (company) {
			let integration = await this.integrationsService.findOneBy({
				type: IntegrationsType.SMS,
				company: {
					hash: company.hash,
				},
			});
			if (!integration) {
				integration = new IntegrationsEntity();
				integration.company = company;
				integration.type = IntegrationsType.SMS;
			}
			const { provider, ...extra } = payload;
			integration.provider = provider;
			integration.config = JSON.stringify(extra);
			return this.integrationsService.update(integration);
		} else {
			throw new NotFoundException('Company not found');
		}
	}

	@UseGuards(GqlAuthGuard, AuthPlansGuard)
	@Mutation(() => IntegrationsEntity)
	async removeIntegration(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
	) {
		const integration = await this.integrationsService.findOneBy({
			id,
			company: {
				users: {
					id: user.id,
				},
			},
		});
		if (integration) {
			await this.integrationsService.remove(integration.id);
			return integration;
		} else {
			throw new NotFoundException('Integration not found');
		}
	}
}
