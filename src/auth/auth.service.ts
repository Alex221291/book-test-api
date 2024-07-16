import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../common/users/users.service';
import md5 from '../base/utils/md5';
import { AuthModel } from './auth.model';
import { UserEntity } from '../common/users/users.entity';
import { RoleTypes } from '../common/users/users.role.enum';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async validateUser(username: string, pass: string): Promise<any> {
		const builder = this.usersService.findWithQueryBuilder();
		builder
			.leftJoinAndSelect('e.companies', 'companies')
			.leftJoinAndSelect('e.employees', 'employees')
			.leftJoinAndSelect('e.plan', 'plan')
			.where('e.email = :email', { email: username })
			.orWhere('e.phone = :phone', { phone: username });
		const user = await builder.getOne();
		if (user && user.password === md5(pass) && user.active) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	async login(user: UserEntity): Promise<AuthModel> {
		const payload = {
			email: user.email,
			sub: user.id,
			status: user.status,
			plan: user.plan,
			role: RoleTypes[user.role],
			employees: user.employees?.map(({ id }) => id),
			companies: user.companies?.map((company) => company.hash),
		};
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
