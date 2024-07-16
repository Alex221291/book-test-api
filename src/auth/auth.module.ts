import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CompaniesModule } from '../common/companies/companies.module';
import { NotificationsModule } from '../common/notifications/notifications.module';
import { PlansModule } from '../common/plans/plans.module';
import { UsersModule } from '../common/users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
	imports: [
		UsersModule,
		CompaniesModule,
		PassportModule,
		NotificationsModule,
		PlansModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '525960m' },
		}),
	],
	providers: [AuthService, LocalStrategy, JwtStrategy, AuthResolver],
	exports: [AuthService],
})
export class AuthModule {}
