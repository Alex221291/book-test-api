import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { ScheduleEntity } from './schedules.entity';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import { UserEntity } from '../users/users.entity';
import { ScheduleInput } from './schedules.input';
import { EmployeesService } from '../employees/employees.service';
import { ServicesService } from '../services/services.service';
import { GroupsService } from '../groups/groups.service';
import { BookingsService } from '../bookings/bookings.service';
import { NotFoundError } from 'rxjs';
import date from '../../base/utils/date';
import time from '../../base/utils/time';
import { DateTime } from 'luxon';
import { BookingsStatuses } from '../bookings/types/bookings.statuses';
import { SchedulesType } from './types/schedules.type';
import { OfficesEntity } from '../offices/offices.entity';
import between from '../../base/utils/between';

@Injectable()
export class ScheduleService extends BaseService<ScheduleEntity> {
	constructor(
		@InjectRepository(ScheduleEntity)
		public repository: Repository<ScheduleEntity>,
		private readonly employeeService: EmployeesService,
		private readonly servicesService: ServicesService,
		private readonly groupService: GroupsService,

		@Inject(forwardRef(() => BookingsService))
		private readonly bookingsService: BookingsService,
	) {
		super();
	}

	protected getDateTimeBetweenCondition(
		since: DateTime,
		until: DateTime,
	): Brackets {
		const min = since.toSQL();
		const max = until.toSQL();
		return new Brackets((qb) => {
			qb.where(`:min <= e.sinceDate AND e.sinceDate < :max`, {
				min,
				max,
			})
				.orWhere(`:min < e.untilDate AND e.untilDate < :max`, {
					min,
					max,
				})
				.orWhere(`e.sinceDate <= :expr1 AND :expr1 < e.untilDate`, {
					expr1: min,
				})
				.orWhere(`e.sinceDate < :expr2 AND :expr2 < e.untilDate`, {
					expr2: max,
				});
		});
	}

	public validateWorkingHours(
		office: OfficesEntity,
		sinceDate: string,
		untilDate: string,
	) {
		const dateObj = date(sinceDate);
		const regExp = /^([0-9]{2})([0-9]{2})/;
		const workDays = JSON.parse(office.workingDays);
		const currDay = dateObj.toFormat('ccc');
		const companyWorkTime = workDays[currDay];
		const from = companyWorkTime.from.replace(regExp, '$1.$2').split('.');
		const to = companyWorkTime.to.replace(regExp, '$1.$2').split('.');
		const start = date(sinceDate).setZone(office.company.timezone).set({
			hour: from[0],
			minute: from[1],
			second: 0,
			millisecond: 0,
		});
		const finish = date(sinceDate).setZone(office.company.timezone).set({
			hour: to[0],
			minute: to[1],
			second: 0,
			millisecond: 0,
		});
		return (
			between(date(sinceDate), start, finish, 'v3') &&
			between(date(untilDate), start, finish, 'v3')
		);
	}

	async validateTimePeriod(
		companyId: string,
		employeeId: number,
		sinceDate: string,
		untilDate: string,
		scheduleId?: number,
		timeZone?: string,
		bookingId?: number,
	) {
		if (sinceDate && untilDate) {
			const sinceDateTime = date(sinceDate).setZone(timeZone);
			const untilDateTime = date(untilDate).setZone(timeZone);
			const builder = this.findWithQueryBuilder();
			builder
				.leftJoinAndSelect('e.employee', 'employee')
				.leftJoinAndSelect('e.bookings', 'bookings')
				.leftJoinAndSelect('employee.office', 'office')
				.leftJoinAndSelect('office.company', 'company');
			builder.andWhere(
				this.getDateTimeBetweenCondition(sinceDateTime, untilDateTime),
			);
			builder
				.andWhere(`e.cancelled NOT IN(1)`)
				.andWhere(`employee.id = :employeeId`, { employeeId })
				.andWhere(`company.hash = '${companyId}'`);
			if (scheduleId) {
				builder.andWhere(`e.id != :scheduleId`, { scheduleId });
			}
			if (bookingId) {
				builder.andWhere(`bookings.id != :bookingId`, { bookingId });
			}
			const [, count] = await builder.getManyAndCount();
			return count === 0;
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}

	async prepareEntity(
		entity: ScheduleEntity,
		payload: ScheduleInput,
		companyId: string,
		userId?: number,
		extraDuration = 0,
	): Promise<ScheduleEntity> {
		const employee = await this.employeeService.getEmployeeById(
			payload.employee,
			companyId,
			payload.services,
			userId,
		);
		if (employee) {
			const users = userId ? { id: userId } : {};
			const timezone = employee.office.company.timezone;
			const sinceDate = date(payload?.sinceDate, timezone);
			const untilDate =
				payload?.untilDate && date(payload?.untilDate, timezone);
			// set start and finish datetime
			entity.sinceDate = sinceDate.toJSDate();
			entity.startTime = time(sinceDate);
			if (payload?.untilDate) {
				entity.untilDate = untilDate.toJSDate();
				entity.finishTime = time(untilDate);
			}
			entity.employee = employee;
			if (!entity.id && payload.type) {
				entity.type = payload.type;
			}
			if (payload.services) {
				const services = await Promise.all(
					payload.services.map(async (id) => {
						return await this.servicesService.findOneBy({
							id,
							company: {
								hash: companyId,
								users,
							},
						});
					}),
				);
				const totalMinutes = services.reduce(
					(a, v) => a + v.duration,
					extraDuration,
				);
				entity.services = services;
				if (!payload?.untilDate) {
					const date = sinceDate.plus({ minute: totalMinutes });
					entity.untilDate = date.toJSDate();
					entity.finishTime = time(date);
				}
			}
			if (payload.groupId) {
				entity.group = await this.groupService.findOneBy({
					id: payload.groupId,
					office: {
						company: {
							hash: companyId,
							users,
						},
					},
				});
			}
			if (payload.bookingId) {
				const builder = await this.bookingsService.getSelectQueryBuilder();
				builder
					.andWhere('e.id = :id', { id: payload.bookingId })
				const booking = await builder.getOne();
				if (booking) {
					entity.bookings = [booking];
				} else {
					throw new NotFoundError('Booking entity not found.');
				}
			}
			return entity;
		}
		throw new NotFoundError('Something went wrong. Try again. :(');
	}

	async getScheduleByDates(
		filters: FiltersExpression[],
		userId: number,
		companyId: string,
		employees: Array<number | string> = [],
		sinceDate?: string,
		untilDate?: string,
	) {
		const builder = this.findWithQueryBuilder(filters);
		builder
			.leftJoinAndSelect('e.services', 'services')
			.leftJoinAndSelect('e.group', 'group')
			.leftJoinAndSelect('e.bookings', 'booking')
			.leftJoinAndSelect('booking.customer', 'customer')
			.leftJoinAndSelect('e.employee', 'employee')
			.leftJoinAndSelect('employee.photo', 'photo')
			.leftJoinAndSelect('employee.office', 'office')
			.leftJoinAndSelect('office.company', 'company')
			.leftJoinAndSelect('company.users', 'users');
		if (sinceDate && untilDate) {
			const sinceDateTime = date(sinceDate);
			const untilDateTime = date(untilDate);
			builder.andWhere(
				this.getDateTimeBetweenCondition(sinceDateTime, untilDateTime),
			);
		}
		builder
			.andWhere(`e.cancelled NOT IN(1)`)
			.andWhere(`company.hash = '${companyId}'`)
			.andWhere(`users.id = ${userId}`);
		if (employees.length > 0) {
			builder.andWhere(`employee.id IN (${[0, ...employees].join(',')})`);
		}
		builder.orderBy('e.sinceDate', 'ASC').orderBy('e.startTime', 'ASC');
		return await builder.getMany();
	}

	async getScheduleTimesByDate(
		employeeIds: number[],
		since: string,
		until: string,
		scheduleIds?: number[],
	) {
		const sinceDateTime = date(since);
		const untilDateTime = date(until);
		const builder = this.repository.createQueryBuilder('e');
		builder
			.leftJoinAndSelect('e.employee', 'employee')
			.leftJoinAndSelect('e.bookings', 'bookings')
			.andWhere(`e.cancelled NOT IN(1)`)
			.andWhere(`employee.id IN (:employeeIds)`, { employeeIds });
		builder.andWhere(
			this.getDateTimeBetweenCondition(sinceDateTime, untilDateTime),
		);
		if (scheduleIds?.length > 0) {
			builder.andWhere(`e.id NOT IN(:scheduleIds)`, { scheduleIds });
		}
		return await builder.getMany();
	}

	async getScheduleById(id: number, user: UserEntity) {
		const builder = this.repository.createQueryBuilder('e');
		builder
			.leftJoinAndSelect('e.employee', 'employee')
			.leftJoinAndSelect('employee.photo', 'photo')
			.leftJoinAndSelect('employee.office', 'office')
			.leftJoinAndSelect('office.company', 'company')
			.leftJoinAndSelect('company.users', 'users')
			.leftJoinAndSelect('e.services', 'services')
			.leftJoinAndSelect('e.bookings', 'booking')
			.leftJoinAndSelect('e.group', 'group')
			.leftJoinAndSelect('booking.customer', 'customer');
		builder
			.andWhere(`e.cancelled NOT IN(1)`)
			.andWhere(`users.id IN(${user.id})`)
			.andWhere(`e.id = ${id}`);
		return await builder.getOne();
	}

	async findAllGroupSchedules(
		sinceDateTime: DateTime,
		untilDateTime: DateTime,
		employeeIds?: number[],
		serviceIds?: number[],
		company?: string,
	): Promise<ScheduleEntity[]> {
		const builder = this.repository.createQueryBuilder('e');
		builder
			.leftJoinAndSelect('e.group', 'group')
			.leftJoinAndSelect('e.employee', 'employee')
			.leftJoinAndSelect('e.services', 'services')
			.leftJoinAndSelect('employee.office', 'office')
			.leftJoinAndSelect('office.company', 'company')
			.leftJoinAndSelect('e.bookings', 'bookings')
			.leftJoinAndSelect('bookings.customer', 'customer');
		builder
			.andWhere(`e.cancelled NOT IN(1)`)
			.andWhere(`e.type = :type`, { type: SchedulesType.GROUP })
			.andWhere(this.getDateTimeBetweenCondition(sinceDateTime, untilDateTime));
		if (employeeIds?.length > 0) {
			builder.andWhere(`employee.id IN(:employeeIds)`, { employeeIds });
		}
		if (serviceIds?.length > 0) {
			builder.andWhere(`services.id IN(:serviceIds)`, { serviceIds });
		}
		if (company) {
			builder.andWhere(`company.hash = :company`, { company });
		}
		return await builder.getMany();
	}

	async flushOutdatedSchedule(bookingId: number, scheduleIds: number[]) {
		let toUpdateScheduleIds = scheduleIds;
		const builder = this.repository.createQueryBuilder('e');
		builder.leftJoinAndSelect('e.bookings', 'bookings');
		builder
			.andWhere('e.id IN (:scheduleIds)', { scheduleIds })
			.andWhere('bookings.status NOT IN(:statuses)', {
				statuses: [BookingsStatuses.CANCELLED],
			})
			.andWhere('bookings.id != :bookingId', { bookingId });
		const skipScheduleIds = (await builder.getMany()).map(({ id }) => id);
		if (skipScheduleIds.length > 0) {
			const toUpdateSchedule = await this.repository
				.createQueryBuilder('e')
				.leftJoinAndSelect('e.bookings', 'bookings')
				.where('bookings.id = :bookingId', { bookingId })
				.andWhere('e.id NOT IN(:skipScheduleIds)', { skipScheduleIds })
				.getMany();
			toUpdateScheduleIds = toUpdateSchedule.map((el) => el.id);
		}
		if (toUpdateScheduleIds.length > 0) {
			return await this.repository
				.createQueryBuilder()
				.update(ScheduleEntity)
				.set({ cancelled: 1 })
				.andWhere('id IN(:toUpdateScheduleIds)', { toUpdateScheduleIds })
				.execute();
		}
		return undefined;
	}
}
