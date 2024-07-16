import { AuthService } from './auth.service';
import { AuthModel } from './auth.model';
import { UserEntity } from '../common/users/users.entity';
import { UsersService } from '../common/users/users.service';
import { CompaniesService } from '../common/companies/companies.service';
import { CompanyInput } from '../common/companies/companies.input';
import { PlansService } from '../common/plans/plans.services';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationsService } from '../common/notifications/notifications.service';
export declare class AuthResolver {
    private readonly authService;
    private readonly userService;
    private readonly companyService;
    private readonly plansService;
    private readonly notificationsService;
    private readonly eventEmitter;
    constructor(authService: AuthService, userService: UsersService, companyService: CompaniesService, plansService: PlansService, notificationsService: NotificationsService, eventEmitter: EventEmitter2);
    login(email: string, password: string): Promise<AuthModel>;
    register(phone: string, password: string): Promise<AuthModel>;
    confirmEmail(hash: string): Promise<UserEntity>;
    resetPasswordRequest(phone: string): Promise<boolean>;
    changePasswordByResettingHash(code: string, password: string): Promise<boolean>;
    onBoarding(user: UserEntity, payload: CompanyInput): Promise<AuthModel>;
}
