import { SetMetadata } from '@nestjs/common';
import { PlanTypes } from '../common/users/users.plan.enum';

export const AUTH_PLANS_KEY = 'plans';
export const Plans = (...plans: PlanTypes[]) => {
	return SetMetadata(AUTH_PLANS_KEY, plans);
};
