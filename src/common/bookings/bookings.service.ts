import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BookingEntity } from './bookings.entity';
import { BookingInput } from './dto/bookings.input';
import { UserEntity } from '../users/users.entity';
import { OfficesService } from '../offices/offices.service';
import { CustomerService } from '../customers/customer.service';
import parsePhoneNumber from '../../base/utils/parsePhoneNumber';
import { CustomerEntity } from '../customers/customer.entity';
import { ScheduleService } from '../schedules/schedules.service';

@Injectable()
export class BookingsService extends BaseService<BookingEntity> {
	constructor(
		@InjectRepository(BookingEntity)
		protected repository: Repository<BookingEntity>,
		private readonly officesService: OfficesService,
		private readonly customerService: CustomerService,

		@Inject(forwardRef(() => ScheduleService))
		private readonly scheduleService: ScheduleService,
	) {
		super();
	}

	public async prepare(
		entity: BookingEntity,
		payload: BookingInput,
		user: UserEntity,
	) {
		const booking = this.repository.merge(entity, payload);
		booking.comment = payload.comment;
		if (payload.officeId) {
			booking.office = await this.officesService.findOneBy({
				id: payload.officeId,
				company: {
					users: {
						id: user.id,
					},
				},
			});
		}
		if (payload.scheduleIds) {
			booking.schedules = await Promise.all(
				payload.scheduleIds.map((scheduleId) => {
					return this.scheduleService.getScheduleById(scheduleId, user);
				}),
			);
		}
		if (payload.customerPhone) {
			booking.customer = await this.customerService.getCustomer(
				{
					phone: parsePhoneNumber(payload.customerPhone),
				},
				user.id,
			);
			if (!booking.customer) {
				booking.customer = await this.customerService.prepare(
					new CustomerEntity(),
					{
						phone: parsePhoneNumber(payload.customerPhone),
						lastName: payload.customerLastName,
						firstName: payload.customerFirstName,
					},
					booking.office.company,
				);
			}
		}
		return booking;
	}

	public getBookingById(hash: string, user: UserEntity) {
		return this.findOneBy(
			{
				hash,
				office: {
					company: {
						users: {
							id: user.id,
						},
					},
				},
			},
			{
				office: true,
				webForm: true,
				schedules: true,
				customer: true,
			},
		);
	}

	public getSelectQueryBuilder(
		parent?: SelectQueryBuilder<BookingEntity>,
	): SelectQueryBuilder<BookingEntity> {
		const builder = parent || this.findWithQueryBuilder();
		builder
			.leftJoinAndSelect('e.customer', 'customer')
			.leftJoinAndSelect('e.office', 'office')
			.leftJoinAndSelect('e.webForm', 'webForm')
			.leftJoinAndSelect('office.company', 'company')
			.leftJoinAndSelect('company.users', 'users')
			.leftJoinAndSelect('e.subscription', 'subscription')
			.leftJoinAndSelect('e.schedules', 'schedule')
			.leftJoinAndSelect('schedule.services', 'services')
			.leftJoinAndSelect('schedule.employee', 'employee')
			.leftJoinAndSelect('employee.photo', 'photo');
		return builder;
	}
}
