import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EmployeesService } from './employees.service';
import { EmployeeEntity } from './employees.entity';
import { EmployeeInput } from './employees.input';
import { User } from '../../auth/user.decorator';
import { UserEntity } from '../users/users.entity';
import { NotFoundException, UseGuards, Logger } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import EmployeesPaginatedResponse from './types/employees.paginate';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import BookingPaginatedResponse from '../bookings/types/boooking.paginate';
import { CompaniesService } from '../companies/companies.service';
import { ServicesService } from '../services/services.service';
import { FileService } from '../file/file.service';
import { NotFoundError } from 'rxjs';
import { WebFormService } from '../webforms/webform.service';
import { OfficesService } from '../offices/offices.service';
import parsePhoneNumber from '../../base/utils/parsePhoneNumber';
import { RoleTypes } from '../users/users.role.enum';
import { UsersStatus } from '../users/users.status.enum';
import { generateRandomCode } from '../../base/utils/generateRandomCode';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlansService } from '../plans/plans.services';
import { NotificationsService } from '../notifications/notifications.service';
import { TelegramService } from '../integrations/messageServices/telegram/telegram.service';

@Resolver(() => EmployeesResolver)
export class EmployeesResolver {
	protected readonly logger = new Logger(EmployeesResolver.name);

	constructor(
		private readonly service: EmployeesService,
		private readonly companyService: CompaniesService,
		private readonly servicesService: ServicesService,
		private readonly fileService: FileService,
		private readonly webFormService: WebFormService,
		private readonly officesService: OfficesService,
		private readonly plansService: PlansService,
		private readonly eventEmitter: EventEmitter2,
		private readonly notificationsService: NotificationsService,
		private readonly telegramSender: TelegramService,
	) {}

	private async prepareEmployee(
		payload: EmployeeInput,
		employee: EmployeeEntity,
		userId: number,
		companyHash?: string,
	): Promise<EmployeeEntity> {
		const company = await this.companyService.findOneBy({
			users: {
				id: userId,
			},
			hash: companyHash,
		});
		if (company) {
			employee.firstName = payload.firstName;
			employee.lastName = payload.lastName;
			employee.phone = parsePhoneNumber(payload.phone);
			employee.jobTitle = payload.jobTitle;
			employee.rate = payload?.rate;
			if (payload.officeId) {
				employee.office = await this.officesService.findOneBy({
					id: payload.officeId,
					company: {
						hash: companyHash,
						users: {
							id: userId,
						},
					},
				});
			}
			if (payload.photo) {
				employee.photo = await this.fileService.findOneBy({
					filename: payload.photo,
				});
			}
			const services = [];
			if (payload?.services) {
				for (const serviceId of payload.services) {
					services.push(
						await this.servicesService.findOneBy({
							id: Number(serviceId),
						}),
					);
				}
			}
			return {
				...employee,
				services,
			} as EmployeeEntity;
		} else {
			throw new NotFoundError('Company not found');
		}
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => EmployeeEntity)
	async addEmployee(
		@User() user: UserEntity,
		@Args('company') companyId: string,
		@Args('entity') entity: EmployeeInput,
	) {
		return this.service.add(
			await this.prepareEmployee(
				entity,
				new EmployeeEntity(),
				user.id,
				companyId,
			),
		);
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => EmployeeEntity)
	async addEmployeePhoto(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
		@Args('fileId', { type: () => Int }) fileId: number,
	) {
		const employee = await this.service.findOneBy(
			{
				id,
				archived: false,
				office: {
					company: {
						users: {
							id: user.id,
						},
					},
				},
			},
			{
				photo: true,
				background: true,
			},
		);
		if (employee) {
			const file = await this.fileService.findOneBy({
				id: fileId,
			});
			if (file) {
				employee.photo = file;
				return this.service.update(employee);
			}
			throw new NotFoundException('file.not.found');
		}
		throw new NotFoundException('employee.not.found');
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => EmployeeEntity)
	async addEmployeeBackground(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
		@Args('fileId', { type: () => Int }) fileId: number,
	) {
		const employee = await this.service.findOneBy(
			{
				id,
				archived: false,
				office: {
					company: {
						users: {
							id: user.id,
						},
					},
				},
			},
			{
				photo: true,
				background: true,
			},
		);
		if (employee) {
			const file = await this.fileService.findOneBy({
				id: fileId,
			});
			if (file) {
				employee.background = file;
				return this.service.update(employee);
			}
			throw new NotFoundException('file.not.found');
		}
		throw new NotFoundException('employee.not.found');
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => EmployeeEntity)
	async updateEmployee(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
		@Args('entity') entity: EmployeeInput,
	) {
		const employee = await this.service.findOneBy({
			id,
			archived: false,
			office: {
				company: {
					users: {
						id: user.id,
					},
				},
			},
		});
		if (employee) {
			return this.service.update(
				await this.prepareEmployee(
					entity,
					employee,
					user.id,
					employee.office.company.hash,
				),
			);
		}
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => EmployeeEntity)
	async setEmployeeAccess(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
		@Args('phone') phone: string,
		@Args('role', { type: () => RoleTypes }) role: RoleTypes,
	) {
		const employee = await this.service.findOneBy({
			id,
			archived: false,
			office: {
				company: {
					users: {
						id: user.id,
					},
				},
			},
		});

		if (employee) {
			if (!employee.user) {
				const plainPassword = generateRandomCode();
				try {
					const message = `Password for ${phone} is ${plainPassword}`
					this.telegramSender.send(process.env.TELEGRAM_LOGS_TOKEN, process.env.TELEGRAM_LOGS_CHAT_ID, message);
				} catch (e) {
					this.logger.warn(e.message);
				}
				const user = new UserEntity(phone, plainPassword.toString());
				user.role = role;
				user.status = UsersStatus.COMPLETED;
				user.companies = [employee.office.company];
				user.plan = await this.plansService.findOneBy({
					code: 'FREE',
				});
				employee.user = user;
				return await this.service.update(employee).then((data) => {
					this.notificationsService.sendSMS(user.phone, `https://app.bookform.by/\r
Vash parol dlya vhoda ${plainPassword}`);

					return data;
				});
			} else {
				employee.user.phone = phone;
				employee.user.role = role;
			}
			return await this.service.update(employee);
		}
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => EmployeeEntity)
	async removeEmployee(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
	): Promise<EmployeeEntity> {
		const employee = await this.service.findOneBy({
			id,
			// archived: false,
			office: {
				company: {
					users: {
						id: user.id,
					},
				},
			},
		});
		if (employee) {
			employee.archived = true;
			employee.user = null;
			employee.webForms = [];
			employee.services = [];
			return this.service.update(employee);
		}
		throw new NotFoundException('Something went wrong. Try again. :(');
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => EmployeeEntity)
	async getEmployeeById(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
	) {
		return this.service.findOneBy(
			{
				id: id,
				office: {
					company: {
						users: {
							id: user.id,
						},
					},
				},
			},
			{
				services: true,
				office: true,
				user: true,
				photo: true,
			},
		);
	}

	@Query(() => EmployeesPaginatedResponse)
	async getEmployees(
		@Args('company') companyId: string,
		@Args('filters', {
			nullable: true,
			defaultValue: [{ operator: 'AND', filters: [] }] as FiltersExpression[],
			type: () => [FiltersExpression],
		})
		filters: FiltersExpression[],
		@Args('sorters', { nullable: true, type: () => [SorterType] })
		sorters?: SorterType[],
		@Args('offset', { type: () => Int, nullable: true }) offset?: number,
		@Args('limit', { type: () => Int, nullable: true }) limit?: number,
	) {
		const builder = this.service.findWithQueryBuilder(
			filters,
			sorters,
			offset,
			limit,
		);
		builder
			.leftJoinAndSelect('e.photo', 'photo')
			.leftJoinAndSelect('e.user', 'user')
			.leftJoinAndSelect('e.services', 'service')
			.leftJoinAndSelect('e.office', 'office')
			.leftJoinAndSelect('office.company', 'company')
			.leftJoinAndSelect('company.users', 'users')
			.andWhere(`company.hash = '${companyId}'`);
		const [data, count] = await builder.getManyAndCount();
		return new BookingPaginatedResponse(data, count, offset, limit);
	}
}
