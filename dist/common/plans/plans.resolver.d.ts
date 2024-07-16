import { PlansService } from './plans.services';
import { PlansEntity } from './plans.entity';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/users.entity';
export declare class PlansResolver {
    private readonly plansService;
    private readonly usersService;
    constructor(plansService: PlansService, usersService: UsersService);
    getPlans(): Promise<PlansEntity[]>;
    upgradePlan(user: UserEntity, code: string): Promise<UserEntity>;
    downgradePlan(user: UserEntity, code: string): Promise<UserEntity>;
}
