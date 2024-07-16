import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BookingsService } from './bookings.service';
import { BookingsStatuses } from './types/bookings.statuses';
import { DateTime } from 'luxon';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BookingEvents } from './bookings.event';

@Injectable()
export class BookingsCron {
	private readonly logger = new Logger(BookingsCron.name);

	constructor(
		private eventEmitter: EventEmitter2,
		private bookingsService: BookingsService,
	) {}

	@Cron(CronExpression.EVERY_MINUTE)
	async handleCron() {
		const builder = this.bookingsService.findWithQueryBuilder();
		builder
			.leftJoinAndSelect('e.webForm', 'webForm')
			.leftJoinAndSelect('e.customer', 'customer')
			.leftJoinAndSelect('e.schedules', 'schedule')
			.leftJoinAndSelect('e.office', 'office')
			.leftJoinAndSelect('office.company', 'company')
			.andWhere('e.status NOT IN (:statuses)', {
				statuses: [
					BookingsStatuses.COMPLETED,
					BookingsStatuses.PAID,
					BookingsStatuses.CANCELLED,
				],
			})
			.andWhere('e.confirmed IS TRUE')
			.andWhere('e.remindSent IS FALSE')
			.andWhere('e.remindFor > 0')
			.andWhere('schedule.sinceDate > NOW()');
		const bookings = await builder.getMany();
		for (const booking of bookings) {
			const schedule = booking.schedules[0];
			const remindDateTime = DateTime.fromJSDate(schedule.sinceDate);
			const diff = remindDateTime.diffNow('minutes').minutes;
			if (diff <= booking.remindFor && diff > booking.remindFor - 5) {
				booking.remindSent = true;
				this.bookingsService.update(booking).then((payload) => {
					this.eventEmitter.emit(BookingEvents.BOOKING_REMIND, payload);
				});
			}
		}
	}
}
