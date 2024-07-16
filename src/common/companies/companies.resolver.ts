import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompanyEntity } from './companies.entity';
import { CompaniesService } from './companies.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { UserEntity } from '../users/users.entity';
import { User } from '../../auth/user.decorator';
import { NotFoundError } from 'rxjs';
import { CompanyInput } from './companies.input';
import { FileService } from '../file/file.service';
import parsePhoneNumber from '../../base/utils/parsePhoneNumber';

@Resolver(() => CompanyEntity)
export class CompaniesResolver {
	constructor(
		private companiesService: CompaniesService,
		private fileService: FileService,
	) {}

	@Query(() => CompanyEntity)
	async getCompany(@Args('id') company: string) {
		const entity = await this.companiesService.findOneBy(
			{
				hash: company,
			},
			{
				logo: true,
			},
		);
		if (entity) {
			return entity;
		} else {
			throw new NotFoundError('Company not found');
		}
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => [CompanyEntity])
	async getCompanies(@User() user: UserEntity) {
		return this.companiesService.findAllBy({
			users: {
				id: user.id,
			},
		});
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => CompanyEntity)
	async addCompany(
		@User() user: UserEntity,
		@Args('entity') payload: CompanyInput,
	) {
		const entity = new CompanyEntity();
		entity.users = [user];
		entity.address = payload.address;
		entity.phone = parsePhoneNumber(payload.phone);
		entity.title = payload.title;
		entity.description = payload.description;
		entity.regNumber = payload.regNumber;
		entity.timezone = payload.timezone;
		if (payload?.logo) {
			entity.logo = await this.fileService.findOneBy({
				filename: payload?.logo,
			});
		}
		return this.companiesService.add(entity);
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => CompanyEntity)
	async updateCompany(
		@User() user: UserEntity,
		@Args('id') id: string,
		@Args('entity') entity: CompanyInput,
	) {
		const company = await this.companiesService.findOneBy({
			hash: id,
			users: {
				id: user.id,
			},
		});
		if (company) {
			company.address = entity.address;
			company.phone = parsePhoneNumber(entity.phone);
			company.title = entity.title;
			company.description = entity.description;
			company.regNumber = entity.regNumber;
			company.timezone = entity.timezone;
			if (entity?.logo) {
				company.logo = await this.fileService.findOneBy({
					filename: entity?.logo,
				});
			}
			return this.companiesService.update(company);
		} else {
			throw new NotFoundError('Company not found');
		}
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => CompanyEntity)
	async removeCompany(@User() user: UserEntity, @Args('id') hash: string) {
		const company = await this.companiesService.findOneBy({
			hash,
			users: {
				id: user.id,
			},
		});
		if (company) {
			await this.companiesService.remove(company.id);
			return company;
		} else {
			throw new NotFoundError('Company not found');
		}
	}
}
