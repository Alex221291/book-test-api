import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { SubscriptionsEntity } from './subscriptions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionsInput } from './subscriptions.input';
import { SubscriptionsPlanService } from './subscriptions.plan.service';
import { CustomerService } from '../customers/customer.service';
import { CompanyEntity } from '../companies/companies.entity';
import { UserEntity } from '../users/users.entity';
import date from '../../base/utils/date';
import parsePhoneNumber from '../../base/utils/parsePhoneNumber';
import { BookingEntity } from '../bookings/bookings.entity';
import { DateTime } from 'luxon';
import { PaymentsEvent } from '../payments/payments.event';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class SubscriptionsService extends BaseService<SubscriptionsEntity> {
	constructor(
		@InjectRepository(SubscriptionsEntity)
		protected repository: Repository<SubscriptionsEntity>,
		private readonly subscriptionPlanService: SubscriptionsPlanService,
		private readonly customerService: CustomerService,
		private readonly paymentsService: PaymentsService,
	) {
		super();
	}

	async prepareEntity(
		payload: SubscriptionsInput,
		entity: SubscriptionsEntity,
		company: CompanyEntity,
		user: UserEntity,
	): Promise<SubscriptionsEntity> {
		const plan = await this.subscriptionPlanService.findOneBy({
			id: payload.plan,
			company: {
				hash: company.hash,
				users: {
					id: user.id,
				},
			},
		});
		const customer = await this.customerService.findOneBy({
			id: payload.customer,
			company: {
				users: {
					id: user.id,
				},
			},
		});
		if (plan && customer) {
			entity.sinceDate = date(payload.sinceDate).startOf('day').toJSDate();
			if (payload.untilDate) {
				entity.untilDate = date(payload.untilDate).endOf('day').toJSDate();
			} else {
				entity.untilDate = date(payload.sinceDate)
					.plus({
						[plan.unit]: plan.validity,
					})
					.minus({ day: 1 })
					.endOf('day')
					.toJSDate();
			}
			entity.plan = plan;
			entity.customer = customer;
			entity.payment = await this.paymentsService.preparePayment(
				{
					type: 'incoming',
					account_key: 'cash',
					purpose: PaymentsEvent.SUBSCRIPTION_SALE,
					userId: user.id,
					amount: entity.plan.price,
				},
				entity.plan.currency,
			);
		}
		return entity;
	}

	findSubscriptionsByServicesIds(
		companyId: string,
		serviceIds: number[],
		customerPhone: string,
		userId: number,
	): Promise<Array<SubscriptionsEntity>> {
		const builder = this.repository.createQueryBuilder('e');
		builder
			.leftJoinAndSelect('e.plan', 'plan')
			.leftJoinAndSelect('e.bookings', 'bookings')
			.leftJoinAndSelect('plan.services', 'services')
			.leftJoinAndSelect('e.customer', 'customer')
			.leftJoinAndSelect(`customer.company`, 'company')
			.leftJoinAndSelect('company.users', 'users');
		builder
			.andWhere((qb) => {
				const subQuery = qb
					.subQuery()
					.select('COUNT(*)')
					.from(BookingEntity, 'booking')
					.where('booking.subscription = e.id');
				return `plan.visits > ${subQuery.getQuery()}`;
			})
			.andWhere(`e.sinceDate <= :date AND :date <= e.untilDate`, {
				date: DateTime.now().toUTC().toISO(),
			})
			.andWhere(`customer.phone = ${parsePhoneNumber(customerPhone)}`)
			.andWhere(`company.hash = '${companyId}'`)
			.andWhere(`users.id IN (${userId})`)
			.andWhere(`services.id IN (${serviceIds.join(',')})`);
		return builder.getMany();
	}
}
