import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { Response } from 'express';
export declare class AppController {
    private readonly appService;
    private authService;
    constructor(appService: AppService, authService: AuthService);
    index(res: Response): Response<any, Record<string, any>>;
    login(req: any): Promise<import("./auth/auth.model").AuthModel>;
}
