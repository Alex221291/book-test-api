import { ExecutionContext } from '@nestjs/common';
declare const WssAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class WssAuthGuard extends WssAuthGuard_base {
    getRequest(context: ExecutionContext): any;
}
export {};
