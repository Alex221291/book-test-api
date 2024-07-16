import { RoleTypes } from '../common/users/users.role.enum';
export declare const AUTH_ROLE_KEY = "roles";
export declare const Roles: (...roles: RoleTypes[]) => import("@nestjs/common").CustomDecorator<string>;
