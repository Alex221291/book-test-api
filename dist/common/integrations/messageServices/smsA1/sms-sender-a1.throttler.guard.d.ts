import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';
export declare class SMSSenderA1ThrottlerGuard extends ThrottlerGuard {
    handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean>;
}
