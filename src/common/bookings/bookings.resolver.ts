import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookingEntity } from './bookings.entity';
import { BookingsService } from './bookings.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { User } from '../../auth/user.decorator';
import { UserEntity } from '../users/users.entity';
import { BookingInput } from './dto/bookings.input';
import { CustomerService } from '../customers/customer.service';
import { ScheduleService } from '../schedules/schedules.service';
import { ServicesService } from '../services/services.service';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import SorterType from '../../base/graphql-sorter/types/sorter.type';
import BookingPaginatedResponse from './types/boooking.paginate';
import { CompaniesService } from '../companies/companies.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BookingEvents } from './bookings.event';
import { EmployeesService } from '../employees/employees.service';
import { OfficesService } from '../offices/offices.service';
import { BookingsStatuses } from './types/bookings.statuses';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { CustomerEntity } from '../customers/customer.entity';
import date from '../../base/utils/date';
import { ScheduleEntity } from '../schedules/schedules.entity';
import { SchedulesType } from '../schedules/types/schedules.type';
import { WebFormService } from '../webforms/webform.service';
import { BookingsWebFormInput } from './bookings.webform.input';
import parsePhoneNumber from '../../base/utils/parsePhoneNumber';
import { PaymentsEvent } from '../payments/payments.event';
import { PaymentsService } from '../payments/payments.service';
import { UsersService } from '../users/users.service';
import { RoleTypes } from '../users/users.role.enum';
import { DateTime } from 'luxon';
import { BookingSimpleInput } from './dto/bookings.simple.input';
import { classToPlain } from 'class-transformer';

@Resolver(() => BookingEntity)
export class BookingsResolver {
	constructor(
		private bookingsService: BookingsService,
		private customerService: CustomerService,
		private scheduleService: ScheduleService,
		private servicesService: ServicesService,
		private companyService: CompaniesService,
		private employeeService: EmployeesService,
		private webFormService: WebFormService,
		private officesService: OfficesService,
		private usersService: UsersService,
		private subscriptionsService: SubscriptionsService,
		private paymentsService: PaymentsService,
		private eventEmitter: EventEmitter2,
	) {}

	@Mutation(() => BookingEntity)
	async addBooking(
		@Args('webFormId') hash: string,
		@Args('payload') payload: BookingsWebFormInput,
	) {
		const webForm = await this.webFormService.findOneBy(
			{
				hash,
			},
			{
				office: {
					company: {},
				},
			},
		);
		if (webForm) {
			const startTime = date().plus({ minute: webForm.delay }).toUTC();
			const owner = await this.usersService.findOneBy({
				companies: {
					id: webForm.office.company.id,
				},
				role: RoleTypes.OWNER,
			});
			const office = webForm.office;
			const booking = new BookingEntity();
			booking.schedules = [];
			booking.confirmed = !webForm.pinProtection;
			booking.office = office;
			booking.webForm = webForm;
			booking.remindFor = payload.remindFor;
			booking.comment = payload.comment;
			booking.customer = await this.customerService.findOneBy({
				phone: parsePhoneNumber(payload.phone),
				company: {
					id: office.company.id,
				},
			});
			if (!booking.customer) {
				if (webForm.isProtected) {
					throw new NotFoundException(
						'Online registration is not available for you',
					);
				}
				const customer = new CustomerEntity();
				customer.phone = parsePhoneNumber(payload.phone);
				customer.firstName = payload.name;
				customer.company = office.company;
				booking.customer = customer;
			}
			if (payload.schedules) {
				for (const scheduleInput of payload.schedules) {
					if (!scheduleInput.id) {
						const scheduleEntity = await this.scheduleService.prepareEntity(
							new ScheduleEntity(),
							scheduleInput,
							office.company.hash,
						);
						scheduleEntity.type = SchedulesType.DEFAULT;
						if (
							(await this.scheduleService.validateTimePeriod(
								office.company.hash,
								scheduleEntity.employee.id,
								scheduleEntity.sinceDate.toISOString(),
								scheduleEntity.untilDate.toISOString(),
							)) &&
							DateTime.fromJSDate(scheduleEntity.sinceDate)
								.toUTC()
								.diff(startTime, 'second').seconds > 0
						) {
							booking.schedules.push(scheduleEntity);
						} else {
							throw new NotFoundException('time.already.taken');
						}
					} else {
						const schedule = await this.scheduleService.findOneBy({
							id: scheduleInput.id,
							employee: {
								office: {
									company: {
										hash: office.company.hash,
									},
								},
							},
						});
						if (schedule) {
							booking.schedules.push(schedule);
						}
					}
				}
				return this.bookingsService.add(booking).then((data) => {
					this.eventEmitter.emit(
						!data.confirmed
							? BookingEvents.BOOKING_CREATED
							: BookingEvents.BOOKING_CONFIRMED,
						data,
					);
					this.eventEmitter.emit(PaymentsEvent.BOOKING_SERVICE_FEE, owner.id);
					return data;
				});
			}
		}
		throw new NotFoundException('Something went wrong. Try again. :(');
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => BookingEntity)
	async addSimpleBooking(
		@User() user: UserEntity,
		@Args('companyId') companyId: string,
		@Args('payload') payload: BookingSimpleInput,
	) {
		const company = await this.companyService.getCompanyByUser(companyId, user);
		if (company) {
			const booking = new BookingEntity();
			booking.comment = payload.comment;
			booking.remindFor = payload.remindFor;
			booking.office = await this.officesService.findOneBy({
				id: payload.office,
				company: {
					hash: companyId,
					users: {
						id: user.id,
					},
				},
			});
			if (payload.phone) {
				booking.customer = await this.customerService.findOneBy({
					phone: payload.phone,
					company: {
						users: {
							id: user.id,
						},
					},
				});
				if (!booking.customer) {
					const customer = new CustomerEntity();
					customer.phone = parsePhoneNumber(payload.phone);
					customer.firstName = payload.name;
					customer.company = company;
					booking.customer = customer;
				}
			}
			if (payload.schedule) {
				booking.schedules = [];
				const scheduleEntity = await this.scheduleService.prepareEntity(
					new ScheduleEntity(),
					payload.schedule,
					booking.office.company.hash,
				);
				scheduleEntity.type = SchedulesType.DEFAULT;
				if (
					await this.scheduleService.validateTimePeriod(
						booking.office.company.hash,
						scheduleEntity.employee.id,
						scheduleEntity.sinceDate.toISOString(),
						scheduleEntity.untilDate.toISOString(),
					)
				) {
					booking.schedules.push(scheduleEntity);
				} else {
					throw new NotFoundException('time.already.taken');
				}
			}
			return this.bookingsService.add(booking).then((data) => {
				this.eventEmitter.emit(PaymentsEvent.BOOKING_SERVICE_FEE, user.id);
				this.eventEmitter.emit(BookingEvents.BOOKING_CONFIRMED, data);
				return data;
			});
		}
		throw new NotFoundException('Something went wrong. Try again. :(');
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => BookingEntity)
	async addBookingByAdmin(
		@User() user: UserEntity,
		@Args('payload') payload: BookingInput,
	) {
		const booking = await this.bookingsService.prepare(
			new BookingEntity(),
			payload,
			user,
		);
		booking.confirmed = true;
		return this.bookingsService.add(booking).then((data) => {
			this.eventEmitter.emit(PaymentsEvent.BOOKING_SERVICE_FEE, user.id);
			this.eventEmitter.emit(BookingEvents.BOOKING_CONFIRMED, data);
			return data;
		});
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => BookingEntity)
	async updateBookingByAdmin(
		@User() user: UserEntity,
		@Args('bookingId') bookingId: string,
		@Args('payload') payload: BookingInput,
	) {
		const booking = await this.bookingsService.getBookingById(bookingId, user);
		if (booking) {
			const entity = await this.bookingsService.prepare(booking, payload, user);
			return this.bookingsService.update(entity);
		}
		throw new NotFoundException('booking.not.found');
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => BookingEntity)
	async changeBookingStatus(
		@User() user: UserEntity,
		@Args('hash') hash: string,
		@Args('status', { type: () => BookingsStatuses }) status: BookingsStatuses,
	) {
		const booking = await this.bookingsService.getBookingById(hash, user);
		if (booking) {
			booking.status = status;
			const data = await this.bookingsService.update(booking).then((el) => {
				if (el.status === BookingsStatuses.CANCELLED) {
					this.eventEmitter.emit(
						BookingEvents.BOOKING_CANCELLED_BY_ADMIN,
						booking,
					);
					this.scheduleService.flushOutdatedSchedule(
						el.id,
						el.schedules.map(({ id }) => id),
					);
				}
				return el;
			});
			return classToPlain(data, { groups: [user.role] });
		}
		throw new NotFoundException('booking.not.found');
	}

	/***
	 * Graphql public resolver to confirmation booking.  The resolver can be used by anonymous users.
	 */
	@Mutation(() => BookingEntity)
	async confirmBooking(@Args('hash') hash: string, @Args('code') code: string) {
		const builder = await this.bookingsService.getSelectQueryBuilder();
		builder
			.andWhere('e.hash = :hash', { hash })
			.andWhere('e.code = :code', { code })
			.andWhere('e.confirmed = false');
		const booking = await builder.getOne();
		if (booking) {
			booking.confirmed = true;
			await this.bookingsService.update(booking).finally(() => {
				this.eventEmitter.emit(BookingEvents.BOOKING_CONFIRMED, booking);
			});
			return booking;
		} else {
			throw new NotFoundException('Wrong confirmation code');
		}
	}

	/***
	 * Graphql public resolver to cancellation booking.  The resolver can be used by anonymous users.
	 */
	@Mutation(() => BookingEntity)
	async cancelBooking(@Args('hash') hash: string) {
		const booking = await this.bookingsService
			.getSelectQueryBuilder()
			.leftJoinAndSelect('e.schedules', 'schedules')
			.andWhere(`e.hash = :hash`, { hash })
			.getOne();
		if (booking) {
			booking.status = BookingsStatuses.CANCELLED;
			return await this.bookingsService
				.update(booking)
				.then((el) => {
					const scheduleIds = el.schedules.map((el) => el.id);
					this.scheduleService.flushOutdatedSchedule(el.id, scheduleIds);
					return el;
				})
				.finally(() => {
					this.eventEmitter.emit(
						BookingEvents.BOOKING_CANCELLED_BY_CUSTOMER,
						booking,
					);
				});
		} else {
			throw new NotFoundException('booking.not.found');
		}
	}

	@UseGuards(GqlAuthGuard)
	@Mutation(() => BookingEntity)
	async closeBooking(
		@User() user: UserEntity,
		@Args('hash') hash: string,
		@Args('amount') amount: number,
	) {
		const booking = await this.bookingsService.getBookingById(hash, user);
		const owner = await this.usersService.findOneBy({
			companies: {
				id: booking.office.company.id,
			},
			role: RoleTypes.OWNER,
		});
		booking.status = BookingsStatuses.COMPLETED;
		booking.payment = await this.paymentsService.preparePayment({
			type: 'incoming',
			account_key: 'cash',
			purpose: PaymentsEvent.CLOSING_BOOKING_PAYMENT,
			userId: owner.id,
			amount,
		});
		return this.bookingsService.update(booking);
	}

	/**
	 * Graphql protected resolver to getting all bookings.
	 */
	@UseGuards(GqlAuthGuard)
	@Query(() => BookingPaginatedResponse)
	async getBookings(
		@User() user: UserEntity,
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
		const builder = this.bookingsService.getSelectQueryBuilder(
			this.bookingsService.findWithQueryBuilder(
				filters,
				sorters,
				offset,
				limit,
			),
		);
		builder
			.leftJoinAndSelect('e.payment', 'payment')
			.andWhere(`users.id IN(${user.id})`)
			.andWhere(`company.hash = '${companyId}'`);
		const [data, count] = await builder.getManyAndCount();
		return new BookingPaginatedResponse(
			classToPlain(data, { groups: [user.role] }),
			count,
			offset,
			limit,
		);
	}

	@Query(() => BookingEntity)
	async getBooking(@Args('hash') hash: string) {
		return this.bookingsService
			.getSelectQueryBuilder()
			.andWhere(`e.hash = :hash`, { hash })
			.getOne();
	}
}
