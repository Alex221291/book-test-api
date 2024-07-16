import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class SMSSenderA1ThrottlerGuard extends ThrottlerGuard {
	async handleRequest(
		context: ExecutionContext,
		limit: number,
		ttl: number,
	): Promise<boolean> {
		const connection = context.switchToRpc();
		const { phone } = connection.getData();
		if (phone) {
			const key = this.generateKey(context, phone);
			const { totalHits } = await this.storageService.increment(key, ttl);
			if (totalHits > limit) {
				const context = connection.getContext();
				context.delay = ttl;
			}
		}
		return true;
	}
}
