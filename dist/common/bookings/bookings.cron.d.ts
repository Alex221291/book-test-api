import { BookingsService } from './bookings.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class BookingsCron {
    private eventEmitter;
    private bookingsService;
    private readonly logger;
    constructor(eventEmitter: EventEmitter2, bookingsService: BookingsService);
    handleCron(): Promise<void>;
}
