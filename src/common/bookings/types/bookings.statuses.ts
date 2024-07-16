import { registerEnumType } from '@nestjs/graphql';

export enum BookingsStatuses {
	PREPARED = 'PREPARED',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
	PAID = 'PAID',
}

registerEnumType(BookingsStatuses, {
	name: 'BookingStatuses',
});
