import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentsService } from './payments.service';
import { PlansService } from '../plans/plans.services';

@Injectable()
export class PaymentsEvent {
	static BOOKING_SERVICE_FEE = 'booking.service.fee';
	static CLOSING_BOOKING_PAYMENT = 'booking.closing.payment';
	static SUBSCRIPTION_SALE = 'subscription.sale';

	constructor(
		private readonly paymentsService: PaymentsService,
		private readonly plansService: PlansService,
	) {}

	@OnEvent(PaymentsEvent.BOOKING_SERVICE_FEE)
	async bookingServiceFee(userId: number) {
		try {
			const plan = await this.plansService.findOneBy({
				users: {
					id: userId,
				},
			});
			if (plan) {
				const existingPayments = await this.paymentsService.findAllBy({
					purpose: PaymentsEvent.BOOKING_SERVICE_FEE,
					user: {
						id: userId,
					},
				});
				const amount =
					existingPayments.length > plan.ordersLimit
						? plan.superProfit
						: plan.profit;
				const payment = await this.paymentsService.preparePayment({
					type: 'outcoming',
					account_key: 'account',
					purpose: PaymentsEvent.BOOKING_SERVICE_FEE,
					userId,
					amount,
				});
				return await this.paymentsService.add(payment);
			}
		} catch (e) {
			// todo
		}
	}
}
