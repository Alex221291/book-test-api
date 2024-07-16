import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
export declare class GqlThrottlerGuard extends ThrottlerGuard {
    getRequestResponse(context: ExecutionContext): {
        req: any;
        res: any;
    };
    protected handleRequest(ctx: any, limit: any, number: any): Promise<boolean>;
}
