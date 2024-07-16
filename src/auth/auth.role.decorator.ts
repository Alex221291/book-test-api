import { SetMetadata } from '@nestjs/common';
import { RoleTypes } from '../common/users/users.role.enum';

export const AUTH_ROLE_KEY = 'roles';
export const Roles = (...roles: RoleTypes[]) => {
	return SetMetadata(AUTH_ROLE_KEY, roles);
};
