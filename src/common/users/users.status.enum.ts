import { registerEnumType } from '@nestjs/graphql';

export enum UsersStatus {
	UNCOMPLETED = 'REGISTRATION_INCOMPLETE',
	COMPLETED = 'REGISTRATION_COMPLETED',
	OVERDUE = 'OVERDUE',
}

registerEnumType(UsersStatus, {
	name: 'UsersStatus',
});
