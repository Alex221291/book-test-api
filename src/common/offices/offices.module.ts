import { forwardRef, Module } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfficesEntity } from './offices.entity';
import { OfficesResolver } from './offices.resolver';
import { CompaniesModule } from '../companies/companies.module';
import { EmployeesModule } from '../employees/employees.module';

@Module({
	imports: [CompaniesModule, TypeOrmModule.forFeature([OfficesEntity])],
	providers: [OfficesService, OfficesResolver],
	exports: [OfficesService],
})
export class OfficesModule {}
