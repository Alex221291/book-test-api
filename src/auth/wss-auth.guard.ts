import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class WssAuthGuard extends AuthGuard('jwt') {
	getRequest(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const req = ctx.getArgByIndex(2);
		return req;
	}
}
