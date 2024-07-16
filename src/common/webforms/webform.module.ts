import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from '../companies/companies.module';
import { WebFormService } from './webform.service';
import { WebFormEntity } from './webform.entity';
import { WebFormResolver } from './webform.resolver';
import { EmployeesModule } from '../employees/employees.module';
import { OfficesModule } from '../offices/offices.module';
import { ServicesModule } from '../services/services.module';

@Module({
	imports: [
		CompaniesModule,
		OfficesModule,
		forwardRef(() => ServicesModule),
		forwardRef(() => EmployeesModule),
		TypeOrmModule.forFeature([WebFormEntity]),
	],
	providers: [WebFormService, WebFormResolver],
	exports: [WebFormService],
})
export class WebFormModule {}
