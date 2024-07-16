import { ScheduleInput } from '../../schedules/schedules.input';
export declare class BookingSimpleInput {
    office: number;
    phone?: string;
    name?: string;
    comment?: string;
    remindFor: number;
    schedule: ScheduleInput;
}
