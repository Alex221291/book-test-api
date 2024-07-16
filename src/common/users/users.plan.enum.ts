import { registerEnumType } from '@nestjs/graphql';

export enum PlanTypes {
	FREE = 'FREE',
	START = 'START',
	MEDIUM = 'MEDIUM',
	PRO = 'PRO',
}

registerEnumType(PlanTypes, {
	name: 'PlanTypes',
});
