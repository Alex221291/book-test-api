import { PlanTypes } from '../common/users/users.plan.enum';
export declare const AUTH_PLANS_KEY = "plans";
export declare const Plans: (...plans: PlanTypes[]) => import("@nestjs/common").CustomDecorator<string>;
