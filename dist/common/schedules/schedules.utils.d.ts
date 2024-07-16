import { ScheduleEntity } from './schedules.entity';
import { DateTime } from 'luxon';
declare class SchedulesUtils {
    static isTaken(s: DateTime, f: DateTime, tasks: any[]): boolean;
    static getFreeTimes(startOfDate: DateTime, endOfDate: DateTime, schedules: Array<ScheduleEntity>, employeeId: any, duration: any, pitch?: number): [[number?, string?, string?]?];
    static getTimePeriods(schedules: Array<ScheduleEntity>, startOfDate: DateTime, endOfDate: DateTime, startWork: DateTime, finishWork: DateTime): Promise<{
        sinceDate: any;
        untilDate: any;
    }[]>;
    static freeTimeCalculation(periods: Array<{
        sinceDate: Date;
        untilDate: Date;
    }>, duration: number, dt: DateTime, employeeId: number): Promise<any[]>;
}
export default SchedulesUtils;
