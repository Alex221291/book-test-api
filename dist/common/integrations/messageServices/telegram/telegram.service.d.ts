import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
export declare class TelegramService {
    private readonly httpService;
    protected readonly logger: Logger;
    constructor(httpService: HttpService);
    send(token: string, chatId: string, message: string): Promise<boolean>;
}
