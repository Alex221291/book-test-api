import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ScheduleService } from './schedules.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { ScheduleEntity } from './schedules.entity';
import { ScheduleInput } from './schedules.input';
import { User } from '../../auth/user.decorator';
import { UserEntity } from '../users/users.entity';
import { EmployeesService } from '../employees/employees.service';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import { ServicesService } from '../services/services.service';
import { GroupsService } from '../groups/groups.service';
import { OfficesService } from '../offices/offices.service';
import { BookingsService } from '../bookings/bookings.service';
import date from 'src/base/utils/date';
import SchedulesUtils from './schedules.utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BookingsStatuses } from '../bookings/types/bookings.statuses';
import { BookingEvents } from '../bookings/bookings.event';
import { SchedulesType } from './types/schedules.type';
import { classToPlain } from 'class-transformer';
import { DateTime } from 'luxon';

@Resolver(() => ScheduleResolver)
export class ScheduleResolver {
	constructor(
		private readonly scheduleService: ScheduleService,
		private readonly employeeService: EmployeesService,
		private readonly servicesService: ServicesService,
		private readonly groupService: GroupsService,
		private readonly officesService: OfficesService,
		private readonly bookingsService: BookingsService,
		private readonly eventEmitter: EventEmitter2,
	) {}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => ScheduleEntity)
	async addScheduleEvent(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('payload') payload: ScheduleInput,
	) {
		const entity = await this.scheduleService.prepareEntity(
			new ScheduleEntity(),
			payload,
			companyId,
			user.id,
			payload.extraDuration,
		);
		if (entity) {
			const office = await this.officesService.findOneBy({
				id: entity.employee.office.id,
			});
			if ([SchedulesType.DEFAULT, SchedulesType.GROUP].includes(entity.type)) {
				if (
					!this.scheduleService.validateWorkingHours(
						office,
						entity.sinceDate.toISOString(),
						entity.untilDate.toISOString(),
					)
				) {
					throw new NotFoundException('notifications.time.unavailable');
				}
			}
			if (
				await this.scheduleService.validateTimePeriod(
					companyId,
					entity.employee.id,
					entity.sinceDate.toISOString(),
					entity.untilDate.toISOString(),
					null,
					null,
					payload.bookingId,
				)
			) {
				return await this.scheduleService.add(entity);
			} else {
				throw new NotFoundException('notifications.time.booked');
			}
		}
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => ScheduleEntity)
	async updateScheduleTime(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
		@Args('sinceDate', { type: () => Date, nullable: true }) sinceDate?: Date,
		@Args('untilDate', { type: () => Date, nullable: true }) untilDate?: Date,
	) {
		const schedule = await this.scheduleService.getScheduleById(id, user);
		if (schedule) {
			return await this.scheduleService.update(
				this.scheduleService.repository.merge(schedule, {
					sinceDate,
					untilDate,
				}),
			);
		}
		throw new NotFoundException('notifications.entity.not.found');
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => ScheduleEntity)
	async updateScheduleEvent(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
		@Args('companyId') companyId: string,
		@Args('payload') payload: ScheduleInput,
	) {
		const schedule = await this.scheduleService.getScheduleById(id, user);
		if (schedule) {
			const entity = await this.scheduleService.prepareEntity(
				schedule,
				payload,
				companyId,
				user.id,
				payload.extraDuration,
			);
			const office = await this.officesService.findOneBy({
				id: entity.employee.office.id,
			});
			if ([SchedulesType.DEFAULT, SchedulesType.GROUP].includes(entity.type)) {
				if (
					!this.scheduleService.validateWorkingHours(
						office,
						entity.sinceDate.toISOString(),
						entity.untilDate.toISOString(),
					)
				) {
					throw new NotFoundException('notifications.time.unavailable');
				}
			}
			if (
				await this.scheduleService.validateTimePeriod(
					companyId,
					entity.employee.id,
					entity.sinceDate.toISOString(),
					entity.untilDate.toISOString(),
					entity.id,
				)
			) {
				await this.scheduleService.update(entity);

				if (entity.bookings) {
					for (const booking of entity.bookings) {
						if (booking.status === BookingsStatuses.PREPARED) {
							this.eventEmitter.emit(
								BookingEvents.BOOKING_UPDATED_BY_ADMIN,
								await this.bookingsService.findOneBy(
									{ id: booking.id },
									{
										office: {
											company: {},
										},
									},
								),
							);
						}
					}
				}
				return this.scheduleService.getScheduleById(schedule.id, user);
			} else {
				throw new NotFoundException('notifications.time.booked');
			}
		} else {
			throw new NotFoundException('notifications.entity.not.found');
		}
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => [ScheduleEntity])
	async getSchedule(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('filters', {
			nullable: true,
			defaultValue: [{ operator: 'AND', filters: [] }] as FiltersExpression[],
			type: () => [FiltersExpression],
		})
		filters: FiltersExpression[],
		@Args('employeeIds', { type: () => [Int], nullable: true })
		employeeIds?: Array<number>,
		@Args('sinceDate', { nullable: true }) sinceDate?: string,
		@Args('untilDate', { nullable: true }) untilDate?: string,
	) {
		const data = await this.scheduleService.getScheduleByDates(
			filters,
			user.id,
			companyId,
			employeeIds,
			sinceDate,
			untilDate,
		);
		return classToPlain(data, { groups: [user.role] });
	}

	@UseGuards(GqlAuthGuard)
	@Query(() => ScheduleEntity)
	async getScheduleById(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
	) {
		const data = await this.scheduleService.getScheduleById(id, user);
		return classToPlain(data, { groups: [user.role] });
	}

	@Query(() => [[String, Number]])
	async getScheduleAvailableDates(
		@Args('officeId', { type: () => Int }) officeId: number,
		@Args('employeeIds', { type: () => [Int] }) employeeIds: number[],
		@Args('sinceDate') since: string,
		@Args('untilDate') until: string,
		@Args('serviceIds', { type: () => [Int], nullable: true })
		serviceIds: number[] = [],
	) {
		let sinceDate = DateTime.fromISO(since);
		const untilDate = DateTime.fromISO(until);
		const services = await this.servicesService.findServicesByIds(
			employeeIds,
			serviceIds,
		);
		const duration = services.reduce((previousValue, currentValue) => {
			return previousValue + currentValue.duration;
		}, 0);
		const payload = [];
		while (untilDate.diff(sinceDate, 'day').days >= 0) {
			const startDay = sinceDate;
			const endDay = startDay.plus({ hour: 23, minute: 59, second: 59 });
			const [startWork, finishWork] =
				await this.officesService.getOfficeWorkTime(officeId, endDay);
			if (startWork && finishWork) {
				for (const employeeId of employeeIds) {
					const schedules = await this.scheduleService.getScheduleTimesByDate(
						[employeeId],
						startWork.toISO(),
						finishWork.toISO(),
					);
					const slots = await SchedulesUtils.getTimePeriods(
						schedules,
						startDay,
						endDay,
						startWork,
						finishWork,
					);
					payload.push(
						await SchedulesUtils.freeTimeCalculation(
							slots,
							duration,
							sinceDate,
							employeeId,
						),
					);
				}
			} else {
				payload.push([sinceDate.toISO(), 0, 0]);
			}
			sinceDate = sinceDate.plus({ days: 1 });
		}
		return Object.entries(
			payload.reduce((arr, el) => {
				const [key, val] = el;
				if (!arr[key]) {
					arr[key] = val;
				} else {
					arr[key] += val;
				}
				return arr;
			}, {}),
		);
	}

	@Query(() => [[String, String]])
	async getScheduleAvailableTimes(
		@Args('officeId', { type: () => Int }) officeId: number,
		@Args('serviceIds', { type: () => [Int] }) serviceIds: number[],
		@Args('employeeIds', { type: () => [Int] }) employeeIds: number[],
		@Args('date') dt: string,
		@Args('extraDuration', { nullable: true, type: () => Int })
		extraDuration = 0,
		@Args('excludeScheduleIds', { nullable: true, type: () => [Int] })
		excludeScheduleIds = [],
		@Args('pitch', { nullable: true, type: () => Int }) pitch = 15,
	) {
		const sinceDate = date(dt);
		const untilDate = sinceDate.plus({ hour: 23, minute: 59, second: 59 });
		const schedule = await this.scheduleService.getScheduleTimesByDate(
			employeeIds,
			sinceDate.toISO(),
			untilDate.toISO(),
			excludeScheduleIds,
		);
		const office = await this.officesService.findOneBy({
			id: officeId,
		});
		const services = await this.servicesService.findServicesByIds(
			employeeIds,
			serviceIds,
		);
		if (
			services.length > 0 &&
			services.length === serviceIds.length &&
			office
		) {
			const [startWork, finishWork] =
				await this.officesService.getOfficeWorkTime(officeId, untilDate);
			if (startWork && finishWork) {
				const duration = services.reduce((previousValue, currentValue) => {
					return previousValue + currentValue.duration;
				}, extraDuration);
				const result: [[number?, string?]?] = [];
				for (const eId of employeeIds) {
					const tasks = schedule.filter(({ employee }) => employee.id === eId);
					SchedulesUtils.getFreeTimes(
						startWork,
						finishWork,
						tasks,
						eId,
						duration,
						pitch,
					).forEach((el) => {
						const [id, iso] = el;
						const found = result.find((o) => o[1] === iso);
						if (!found) {
							result.push([id, iso]);
						}
					});
				}
				return result
					.sort((a, b) => {
						if (a[0] > b[0]) {
							return 1;
						}
						if (a[0] < b[0]) {
							return -1;
						}
						return 0;
					})
					.filter(
						([, iso]) => DateTime.fromISO(iso).diffNow('minute').minutes > 0,
					);
			}
		}
		return [];
	}

	@Query(() => [ScheduleEntity])
	async getGroupScheduleEvents(
		@Args('company') company: string,
		@Args('employeeIds', { type: () => [Int] }) employeeIds: number[],
		@Args('serviceIds', { type: () => [Int] }) serviceIds: number[],
		@Args('date') dt: string,
	) {
		const startOf = date(dt).startOf('day');
		const endOf = startOf.endOf('day');
		return this.scheduleService.findAllGroupSchedules(
			startOf,
			endOf,
			employeeIds,
			serviceIds,
			company,
		);
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => Boolean)
	async removeSchedule(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('id', { type: () => Int }) id: number,
	) {
		const entity = await this.scheduleService.getScheduleById(id, user);
		if (entity?.id) {
			await this.scheduleService.remove(entity?.id);
			return true;
		}
		return false;
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => ScheduleEntity)
	async cancelSchedule(
		@User() user: UserEntity,
		@Args('id', { type: () => Int }) id: number,
	) {
		const entity = await this.scheduleService.getScheduleById(id, user);
		if (entity?.id) {
			entity.cancelled = 1;
			return await this.scheduleService.update(entity);
		}
		throw new NotFoundException('notifications.entity.not.found');
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => ScheduleEntity)
	async addScheduleToBooking(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('bookingId', { type: () => Int }) bookingId: number,
		@Args('id', { type: () => Int }) id: number,
	): Promise<ScheduleEntity> {
		const entity = await this.scheduleService.getScheduleById(id, user);
		if (entity) {
			const builder = this.bookingsService.getSelectQueryBuilder();
			builder
				.andWhere('e.id = :id', { id: bookingId })
				.andWhere('company.hash = :hash', { hash: companyId })
				.andWhere('users.id IN (:userId)', { userId: user.id });
			const booking = await builder.getOne();
			if (booking) {
				entity.bookings.push(booking);
			}
			return await this.scheduleService.update(entity);
		}
		throw new NotFoundException('notifications.entity.not.found');
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => Boolean)
	async removeBookingFromSchedule(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('bookingId', { type: () => Int }) bookingId: number,
		@Args('id', { type: () => Int }) id: number,
	): Promise<boolean> {
		const entity = await this.scheduleService.getScheduleById(id, user);
		if (entity) {
			entity.bookings = entity.bookings.filter(({ id }) => id !== bookingId);
			await this.scheduleService.update(entity);
			if (entity.bookings.length === 0) {
				await this.scheduleService.remove(entity.id);
			}
			return true;
		}
		throw new NotFoundException('notifications.entity.not.found');
	}
}
