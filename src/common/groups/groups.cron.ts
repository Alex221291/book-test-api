import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GroupsService } from './groups.service';
import { ScheduleService } from '../schedules/schedules.service';
import date from '../../base/utils/date';
import { BookingsService } from '../bookings/bookings.service';
import { BookingEntity } from '../bookings/bookings.entity';
import { BookingsStatuses } from '../bookings/types/bookings.statuses';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class GroupsCron {
	private readonly logger = new Logger(GroupsCron.name);

	constructor(
		private readonly groupService: GroupsService,
		private readonly scheduleService: ScheduleService,
		private readonly bookingsService: BookingsService,
		private readonly notificationService: NotificationsService,
	) {}

	@Cron(CronExpression.EVERY_30_SECONDS)
	async handleCron() {
		const sinceDate = date().startOf('day').toUTC();
		const untilDate = date().plus({ day: 1 }).endOf('day').toUTC();
		const items = await this.scheduleService.findAllGroupSchedules(
			sinceDate,
			untilDate,
		);
		for (const schedule of items) {
			if (schedule.group?.id) {
				const group = await this.groupService.findOneBy(
					{
						id: schedule.group?.id,
						office: {
							id: schedule.employee.office.id,
						},
					},
					{
						customers: {
							customer: true,
						},
						office: {
							company: true,
						},
					},
				);
				if (group) {
					group.customers.map((customer) => {
						const foundCustomer = schedule.bookings.find((booking) => {
							return booking.customer.id === customer.customer.id;
						});
						if (!foundCustomer) {
							const booking = new BookingEntity();
							booking.customer = customer.customer;
							booking.schedules = [schedule];
							booking.office = group.office;
							this.bookingsService
								.add(booking)
								.then(() => {
									this.notificationService.createNotification(
										booking.office.company.hash,
										'group.created',
										'notifications.group.created',
										JSON.stringify({
											id: booking.id,
											hash: booking.hash,
											phone: booking.customer.phone,
											company: booking.office.company.hash,
										}),
									);
								})
								.catch((e) => {
									this.logger.error(e.message);
								});
						}
					});
				}
			}
		}
	}
}
