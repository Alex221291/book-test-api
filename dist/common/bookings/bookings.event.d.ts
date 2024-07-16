import { Logger } from '@nestjs/common';
import { IntegrationsService } from '../integrations/integrations.service';
import { BookingEntity } from './bookings.entity';
import { NotificationsEvent } from '../notifications/notifications.event';
export declare class BookingEvents {
    private readonly integrationService;
    private readonly notificationsService;
    static BOOKING_CREATED: string;
    static BOOKING_CONFIRMED: string;
    static BOOKING_REMIND: string;
    static BOOKING_CANCELLED_BY_CUSTOMER: string;
    static BOOKING_CANCELLED_BY_ADMIN: string;
    static BOOKING_UPDATED_BY_ADMIN: string;
    protected readonly logger: Logger;
    constructor(integrationService: IntegrationsService, notificationsService: NotificationsEvent);
    private sendSystemNotification;
    private prepareKeys;
    sendPinCodeBySMS(booking: BookingEntity): Promise<void>;
    sendBookingDetailsBySMS(booking: BookingEntity): Promise<void>;
    sentBookingDetailsByTelegram(booking: BookingEntity): Promise<void>;
    sendCancelNotificationBySMS(booking: BookingEntity): Promise<void>;
    sendUpdatedBookingDetailsBySMS(booking: BookingEntity): Promise<void>;
    sendCancelNotificationByTelegram(booking: BookingEntity): Promise<void>;
    sendBookingCustomerRemind(booking: BookingEntity): Promise<void>;
}
