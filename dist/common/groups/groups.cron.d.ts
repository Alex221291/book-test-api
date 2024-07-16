import { GroupsService } from './groups.service';
import { ScheduleService } from '../schedules/schedules.service';
import { BookingsService } from '../bookings/bookings.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class GroupsCron {
    private readonly groupService;
    private readonly scheduleService;
    private readonly bookingsService;
    private readonly notificationService;
    private readonly logger;
    constructor(groupService: GroupsService, scheduleService: ScheduleService, bookingsService: BookingsService, notificationService: NotificationsService);
    handleCron(): Promise<void>;
}
