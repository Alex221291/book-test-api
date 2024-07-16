import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
	getRequestResponse(context: ExecutionContext) {
		const type = context.getType<string>();
		if (type === 'graphql') {
			const gqlCtx = GqlExecutionContext.create(context);
			const ctx = gqlCtx.getContext();
			return { req: ctx.req, res: ctx.res };
		}
		const http = context.switchToHttp();
		return { req: http.getRequest(), res: http.getResponse() };
	}

	protected async handleRequest(ctx, limit, number) {
		const gqlArgs = ctx.getArgByIndex(3);
		if (gqlArgs?.operation) {
			const { operation } = gqlArgs?.operation;
			if (operation === 'mutation') {
				await new Promise((r) => setTimeout(r, 500));
			}
			if (operation === 'query') {
				await new Promise((r) => setTimeout(r, 300));
			}
		}
		return super.handleRequest(ctx, limit, number);
	}
}
