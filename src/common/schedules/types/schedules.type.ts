import { registerEnumType } from '@nestjs/graphql';

export enum SchedulesType {
	GROUP = 'GROUP',
	DEFAULT = 'DEFAULT',
	DAYOFF = 'DAYOFF',
	TIMEOFF = 'TIMEOFF',
	VACATION = 'VACATION',
	SICK = 'SICK',
}

registerEnumType(SchedulesType, {
	name: 'SchedulesType',
});
