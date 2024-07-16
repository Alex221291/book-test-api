import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './companies.entity';
import { CompaniesResolver } from './companies.resolver';
import { FileModule } from '../file/file.module';

@Module({
	imports: [TypeOrmModule.forFeature([CompanyEntity]), FileModule],
	providers: [CompaniesService, CompaniesResolver],
	exports: [CompaniesService],
})
export class CompaniesModule {}
