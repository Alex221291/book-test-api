import { BaseService } from '../../base/base.service';
import { Brackets, Repository } from 'typeorm';
import { ScheduleEntity } from './schedules.entity';
import FiltersExpression from '../../base/graphql-filter/types/filters.type';
import { UserEntity } from '../users/users.entity';
import { ScheduleInput } from './schedules.input';
import { EmployeesService } from '../employees/employees.service';
import { ServicesService } from '../services/services.service';
import { GroupsService } from '../groups/groups.service';
import { BookingsService } from '../bookings/bookings.service';
import { DateTime } from 'luxon';
import { OfficesEntity } from '../offices/offices.entity';
export declare class ScheduleService extends BaseService<ScheduleEntity> {
    repository: Repository<ScheduleEntity>;
    private readonly employeeService;
    private readonly servicesService;
    private readonly groupService;
    private readonly bookingsService;
    constructor(repository: Repository<ScheduleEntity>, employeeService: EmployeesService, servicesService: ServicesService, groupService: GroupsService, bookingsService: BookingsService);
    protected getDateTimeBetweenCondition(since: DateTime, until: DateTime): Brackets;
    validateWorkingHours(office: OfficesEntity, sinceDate: string, untilDate: string): boolean;
    validateTimePeriod(companyId: string, employeeId: number, sinceDate: string, untilDate: string, scheduleId?: number, timeZone?: string, bookingId?: number): Promise<boolean>;
    prepareEntity(entity: ScheduleEntity, payload: ScheduleInput, companyId: string, userId?: number, extraDuration?: number): Promise<ScheduleEntity>;
    getScheduleByDates(filters: FiltersExpression[], userId: number, companyId: string, employees?: Array<number | string>, sinceDate?: string, untilDate?: string): Promise<ScheduleEntity[]>;
    getScheduleTimesByDate(employeeIds: number[], since: string, until: string, scheduleIds?: number[]): Promise<ScheduleEntity[]>;
    getScheduleById(id: number, user: UserEntity): Promise<ScheduleEntity>;
    findAllGroupSchedules(sinceDateTime: DateTime, untilDateTime: DateTime, employeeIds?: number[], serviceIds?: number[], company?: string): Promise<ScheduleEntity[]>;
    flushOutdatedSchedule(bookingId: number, scheduleIds: number[]): Promise<import("typeorm").UpdateResult>;
}
