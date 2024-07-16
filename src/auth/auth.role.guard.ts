import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RoleTypes } from '../common/users/users.role.enum';
import { AUTH_ROLE_KEY } from './auth.role.decorator';

@Injectable()
export class AuthRoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<RoleTypes[]>(
			AUTH_ROLE_KEY,
			[context.getHandler(), context.getClass()],
		);
		if (!requiredRoles) {
			return true;
		}
		const ctx = GqlExecutionContext.create(context);
		const { user } = ctx.getContext().req;
		if (!requiredRoles.some((role) => user.role === role)) {
			throw new ForbiddenException('low.access.level');
		}
		return true;
	}
}
