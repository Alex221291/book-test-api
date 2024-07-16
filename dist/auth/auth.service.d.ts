import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../common/users/users.service';
import { AuthModel } from './auth.model';
import { UserEntity } from '../common/users/users.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(username: string, pass: string): Promise<any>;
    login(user: UserEntity): Promise<AuthModel>;
}
