import { ScheduleInput } from '../schedules/schedules.input';
export declare class BookingsWebFormInput {
    office: number;
    name: string;
    phone: string;
    comment?: string;
    remindFor?: number;
    schedules: Array<ScheduleInput>;
}
