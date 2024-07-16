import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansEntity } from './plans.entity';
import { PlansService } from './plans.services';
import { PlansResolver } from './plans.resolver';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [UsersModule, TypeOrmModule.forFeature([PlansEntity])],
	providers: [PlansService, PlansResolver],
	exports: [PlansService],
})
export class PlansModule {}
