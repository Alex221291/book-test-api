import { forwardRef, Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesResolver } from './services.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from './services.entity';
import { CompaniesModule } from '../companies/companies.module';
import { CategoriesModule } from '../categories/categories.module';
import { TagsModule } from '../tags/tags.module';

@Module({
	imports: [
		CompaniesModule,
		CategoriesModule,
		TagsModule,
		TypeOrmModule.forFeature([ServiceEntity]),
	],
	providers: [ServicesService, ServicesResolver],
	exports: [ServicesService],
})
export class ServicesModule {}
