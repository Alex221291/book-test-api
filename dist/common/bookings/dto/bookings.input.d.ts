import { BookingEntity } from '../bookings.entity';
declare const BookingInput_base: import("@nestjs/common").Type<Partial<BookingEntity>>;
export declare class BookingInput extends BookingInput_base {
    officeId: number;
    customerPhone: string;
    customerFirstName: string;
    customerLastName: string;
    comment: string;
    remindFor: number;
    scheduleIds?: Array<number>;
}
export {};
