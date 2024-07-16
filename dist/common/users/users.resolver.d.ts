import { UserEntity } from './users.entity';
import { UsersService } from './users.service';
import { UserInput } from './users.input';
export declare class UsersResolver {
    private userService;
    constructor(userService: UsersService);
    sendConfirmationLink(user: UserEntity): Promise<boolean>;
    getUser(user: UserEntity): Promise<UserEntity>;
    getAllUsers(): Promise<UserEntity[]>;
    addUser(entity: UserInput): Promise<UserEntity>;
    updateUser(user: UserEntity, entity: UserInput): Promise<UserEntity>;
    changePassword(user: UserEntity, password: string, newPassword: string): Promise<UserEntity>;
    removeUser(id: number): Promise<void>;
}
