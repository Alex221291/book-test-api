import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesEntity } from './categories.entity';
import { CategoriesResolver } from './categories.resolver';

@Module({
	imports: [TypeOrmModule.forFeature([CategoriesEntity])],
	providers: [CategoriesService, CategoriesResolver],
	exports: [CategoriesService],
})
export class CategoriesModule {}
