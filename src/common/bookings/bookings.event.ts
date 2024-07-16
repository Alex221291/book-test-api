import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IntegrationsService } from '../integrations/integrations.service';
import { BookingEntity } from './bookings.entity';
import { NotificationsEvent } from '../notifications/notifications.event';
import { IntegrationsType } from '../integrations/integrations.type';

@Injectable()
export class BookingEvents {
	static BOOKING_CREATED = 'booking.created';
	static BOOKING_CONFIRMED = 'booking.confirmed';
	static BOOKING_REMIND = 'booking.remind';
	static BOOKING_CANCELLED_BY_CUSTOMER = 'booking.cancelled.customer';
	static BOOKING_CANCELLED_BY_ADMIN = 'booking.cancelled.admin';
	static BOOKING_UPDATED_BY_ADMIN = 'booking.admin.updated';
	protected readonly logger = new Logger(BookingEvents.name);

	constructor(
		private readonly integrationService: IntegrationsService,
		private readonly notificationsService: NotificationsEvent,
	) {}

	private sendSystemNotification(booking: BookingEntity, type: string) {
		return this.notificationsService.addNotification(
			booking.office.company.hash,
			type,
			`notifications.${type}`,
			JSON.stringify({
				id: booking.id,
				hash: booking.hash,
				phone: booking.customer.phone,
				company: booking.office.company.hash,
			}),
		);
	}

	private prepareKeys(booking: BookingEntity) {
		return {
			id: booking.id,
			phone: booking.customer.phone,
			status: booking.status,
			address: booking.office.address,
			title: booking.office.company.title,
			company: booking.office.company.hash,
			hash: booking.hash,
			code: booking.code,
			webForm: booking?.webForm?.hash || '-',
			hour: booking.remindFor / 60,
		};
	}

	@OnEvent(BookingEvents.BOOKING_CREATED)
	async sendPinCodeBySMS(booking: BookingEntity) {
		try {
			const integration = await this.integrationService.findOneBy({
				type: IntegrationsType.SMS,
				company: {
					hash: booking.office.company.hash,
				},
			});
			if (integration) {
				const provider = this.integrationService.getMessageIntegrationProvider(
					integration.provider,
					integration.config,
				);
				if (provider && provider.templates.code?.length > 0) {
					provider.setRecipient(booking.customer.phone);
					provider.setBody(
						provider.prepareBody(
							provider.templates.code,
							this.prepareKeys(booking),
						),
					);
					await provider.send();
				}
			}
		} catch (e) {
			this.logger.error(e.message);
		}
	}

	@OnEvent(BookingEvents.BOOKING_CONFIRMED)
	async sendBookingDetailsBySMS(booking: BookingEntity) {
		try {
			const integration = await this.integrationService.findOneBy({
				type: IntegrationsType.SMS,
				company: {
					hash: booking.office.company.hash,
				},
			});
			console.log('integration', integration)
			if (integration) {
				const provider = this.integrationService.getMessageIntegrationProvider(
					integration.provider,
					integration.config,
				);
				if (provider && provider.templates.created?.length > 0) {
					provider.setRecipient(booking.customer.phone);
					provider.setBody(
						provider.prepareBody(
							provider.templates.created,
							this.prepareKeys(booking),
						),
					);
					await provider.send();
				}
			}
			await this.sendSystemNotification(
				booking,
				BookingEvents.BOOKING_CONFIRMED,
			);
		} catch (e) {
			this.logger.error(e.message);
		}
	}

	@OnEvent(BookingEvents.BOOKING_CONFIRMED)
	async sentBookingDetailsByTelegram(booking: BookingEntity) {
		try {
			const integration = await this.integrationService.findOneBy({
				type: IntegrationsType.TELEGRAM,
				company: {
					hash: booking.office.company.hash,
				},
			});
			if (integration) {
				const provider = this.integrationService.getMessageIntegrationProvider(
					integration.provider,
					integration.config,
				);
				if (provider && provider.templates.draft?.length > 0) {
					provider.setBody(
						provider.prepareBody(
							provider.templates.draft,
							this.prepareKeys(booking),
						),
					);
					await provider.send();
				}
			}
		} catch (e) {
			this.logger.error(e.message);
		}
	}

	@OnEvent(BookingEvents.BOOKING_CANCELLED_BY_ADMIN)
	async sendCancelNotificationBySMS(booking: BookingEntity) {
		try {
			const integration = await this.integrationService.findOneBy({
				type: IntegrationsType.SMS,
				company: {
					hash: booking.office.company.hash,
				},
			});
			if (integration) {
				const provider = this.integrationService.getMessageIntegrationProvider(
					integration.provider,
					integration.config,
				);
				if (provider && provider.templates.cancelled?.length > 0) {
					provider.setRecipient(booking.customer.phone);
					provider.setBody(
						provider.prepareBody(
							provider.templates.cancelled,
							this.prepareKeys(booking),
						),
					);
					await provider.send();
				}
			}
			await this.sendSystemNotification(
				booking,
				BookingEvents.BOOKING_CANCELLED_BY_ADMIN,
			);
		} catch (e) {
			this.logger.error(e.message);
		}
	}

	@OnEvent(BookingEvents.BOOKING_UPDATED_BY_ADMIN)
	async sendUpdatedBookingDetailsBySMS(booking: BookingEntity) {
		try {
			const integration = await this.integrationService.findOneBy({
				type: IntegrationsType.SMS,
				company: {
					hash: booking.office.company.hash,
				},
			});
			if (integration) {
				const provider = this.integrationService.getMessageIntegrationProvider(
					integration.provider,
					integration.config,
				);
				if (provider && provider.templates.updated?.length > 0) {
					provider.setRecipient(booking.customer.phone);
					provider.setBody(
						provider.prepareBody(
							provider.templates.updated,
							this.prepareKeys(booking),
						),
					);
					await provider.send();
				}
			}
		} catch (e) {
			this.logger.error(e.message);
		}
	}

	@OnEvent(BookingEvents.BOOKING_CANCELLED_BY_CUSTOMER)
	async sendCancelNotificationByTelegram(booking: BookingEntity) {
		try {
			const integration = await this.integrationService.findOneBy({
				type: IntegrationsType.TELEGRAM,
				company: {
					hash: booking.office.company.hash,
				},
			});
			if (integration) {
				const provider = this.integrationService.getMessageIntegrationProvider(
					integration.provider,
					integration.config,
				);
				if (provider && provider.templates.cancelled?.length > 0) {
					provider.setBody(
						provider.prepareBody(
							provider.templates.cancelled,
							this.prepareKeys(booking),
						),
					);
					await provider.send();
				}
			}
		} catch (e) {
			this.logger.error(e.message);
		}
	}

	@OnEvent(BookingEvents.BOOKING_REMIND)
	async sendBookingCustomerRemind(booking: BookingEntity) {
		try {
			const integration = await this.integrationService.findOneBy({
				type: IntegrationsType.SMS,
				company: {
					hash: booking.office.company.hash,
				},
			});
			if (integration) {
				const provider = this.integrationService.getMessageIntegrationProvider(
					integration.provider,
					integration.config,
				);
				if (provider && provider.templates.reminder?.length > 0) {
					provider.setRecipient(booking.customer.phone);
					provider.setBody(
						provider.prepareBody(
							provider.templates.reminder,
							this.prepareKeys(booking),
						),
					);
					await provider.send();
				}
			}
		} catch (e) {
			this.logger.error(e.message);
		}
	}
}
