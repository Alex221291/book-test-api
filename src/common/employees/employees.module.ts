import { forwardRef, Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from './employees.entity';
import { EmployeesResolver } from './employees.resolver';
import { CompaniesModule } from '../companies/companies.module';
import { ServicesModule } from '../services/services.module';
import { FileModule } from '../file/file.module';
import { WebFormModule } from '../webforms/webform.module';
import { OfficesModule } from '../offices/offices.module';
import { PlansModule } from '../plans/plans.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
	imports: [
		CompaniesModule,
		forwardRef(() => ServicesModule),
		OfficesModule,
		FileModule,
		PlansModule,
		forwardRef(() => WebFormModule),
		TypeOrmModule.forFeature([EmployeeEntity]),
		NotificationsModule,
	],
	providers: [EmployeesService, EmployeesResolver],
	exports: [EmployeesService],
})
export class EmployeesModule {}
