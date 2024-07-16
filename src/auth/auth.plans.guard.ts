import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PlanTypes } from '../common/users/users.plan.enum';
import { AUTH_PLANS_KEY } from './auth.plans.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthPlansGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<PlanTypes[]>(
			AUTH_PLANS_KEY,
			[context.getHandler(), context.getClass()],
		);
		if (!requiredRoles) {
			return true;
		}
		const ctx = GqlExecutionContext.create(context);
		const { user } = ctx.getContext().req;
		if (!requiredRoles.some((role) => user.plan.code === role)) {
			throw new ForbiddenException('low.access.level');
		}
		return true;
	}
}
