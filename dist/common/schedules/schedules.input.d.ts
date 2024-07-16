import { SchedulesType } from './types/schedules.type';
export declare class ScheduleInput {
    id?: number;
    sinceDate: string;
    untilDate?: string;
    services?: number[];
    extraDuration?: number;
    groupId?: number;
    employee: number;
    bookingId?: number;
    type?: SchedulesType;
}
