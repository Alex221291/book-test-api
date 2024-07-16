import { forwardRef, Module } from '@nestjs/common';
import { ScheduleService } from './schedules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleEntity } from './schedules.entity';
import { ScheduleResolver } from './schedules.resolver';
import { EmployeesModule } from '../employees/employees.module';
import { ServicesModule } from '../services/services.module';
import { GroupsModule } from '../groups/groups.module';
import { OfficesModule } from '../offices/offices.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
	imports: [
		EmployeesModule,
		forwardRef(() => ServicesModule),
		OfficesModule,
		forwardRef(() => GroupsModule),
		forwardRef(() => BookingsModule),
		TypeOrmModule.forFeature([ScheduleEntity]),
	],
	providers: [ScheduleService, ScheduleResolver],
	exports: [ScheduleService],
})
export class SchedulesModule {}
