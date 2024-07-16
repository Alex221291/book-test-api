import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersResolver } from './users.resolver';
import { UserEntity } from './users.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { PlansModule } from '../plans/plans.module';

@Module({
	imports: [NotificationsModule, TypeOrmModule.forFeature([UserEntity])],
	providers: [UsersService, UsersResolver],
	exports: [UsersService],
})
export class UsersModule {}
