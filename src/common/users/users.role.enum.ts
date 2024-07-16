import { registerEnumType } from '@nestjs/graphql';

export enum RoleTypes {
	NONE = 'NONE',
	EMPLOYEE = 'EMPLOYEE',
	EMPLOYEE_EXTERNAL = 'EMPLOYEE_EXTERNAL',
	ADMIN = 'ADMIN',
	ADMIN_EXTERNAL = 'ADMIN_EXTERNAL',
	OWNER = 'OWNER',
}

registerEnumType(RoleTypes, {
	name: 'RoleTypes',
});
