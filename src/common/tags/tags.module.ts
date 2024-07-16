import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsEntity } from './tags.entity';
import { TagsResolver } from './tags.resolver';
import { CompaniesModule } from '../companies/companies.module';
import { CustomerModule } from '../customers/customer.module';

@Module({
	imports: [
		CompaniesModule,
		CustomerModule,
		TypeOrmModule.forFeature([TagsEntity]),
	],
	providers: [TagsService, TagsResolver],
	exports: [TagsService],
})
export class TagsModule {}
