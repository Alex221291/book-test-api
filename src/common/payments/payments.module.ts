import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsEvent } from './payments.event';
import { PlansModule } from '../plans/plans.module';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsEntity } from './payments.entity';
import { PaymentsResolver } from './payments.resolver';

@Module({
	imports: [
		PlansModule,
		UsersModule,
		TypeOrmModule.forFeature([PaymentsEntity]),
	],
	providers: [PaymentsService, PaymentsEvent, PaymentsResolver],
	exports: [PaymentsService],
})
export class PaymentsModule {}
