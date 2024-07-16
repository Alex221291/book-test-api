import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyEntity } from '../companies/companies.entity';
import { ServiceEntity } from '../services/services.entity';

@ObjectType()
@Entity('categories')
export class CategoriesEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column()
	title: string;

	@Field(() => Boolean)
	@Column({ type: 'boolean', default: false })
	archived: boolean;

	@Field(() => CompanyEntity, { nullable: true })
	@ManyToOne(() => CompanyEntity, (entity) => entity.categories, {
		eager: true,
	})
	company: CompanyEntity;

	@Field(() => [ServiceEntity], { nullable: true })
	@OneToMany(() => ServiceEntity, (entity) => entity.category)
	services: ServiceEntity[];
}
