import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
export declare class SMSSenderA1Service {
    private readonly httpService;
    protected readonly logger: Logger;
    constructor(httpService: HttpService);
    sendSMS(user: string, apikey: string, msisdn: string, text: string, extra?: {}): Promise<boolean>;
}
