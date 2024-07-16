import { WebFormEntity } from './webform.entity';
declare const WebFormInput_base: import("@nestjs/common").Type<Partial<WebFormEntity>>;
export declare class WebFormInput extends WebFormInput_base {
    title: string;
    type: string;
    hash: string;
    description: string;
    pinProtection: boolean;
    isProtected: boolean;
    firstStepHidden: boolean;
    delay: number;
    pitch: number;
    maxAppointmentPeriod: number;
    officeId: number;
    serviceIds: Array<number>;
    employeeIds: Array<number>;
}
export {};
