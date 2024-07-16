import { forwardRef, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './customer.entity';
import { CustomerResolver } from './customer.resolver';
import { GroupsModule } from '../groups/groups.module';
import { CompaniesModule } from '../companies/companies.module';
import { TagsModule } from '../tags/tags.module';

@Module({
	imports: [
		CompaniesModule,
		forwardRef(() => TagsModule),
		forwardRef(() => GroupsModule),
		TypeOrmModule.forFeature([CustomerEntity]),
	],
	providers: [CustomerService, CustomerResolver],
	exports: [CustomerService],
})
export class CustomerModule {}
