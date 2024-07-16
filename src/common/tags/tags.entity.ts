import {
	BaseEntity,
	Column,
	Entity,
	ManyToMany, ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CustomerEntity } from '../customers/customer.entity';
import { CompanyEntity } from '../companies/companies.entity';
import { ServiceEntity } from '../services/services.entity';

@ObjectType()
@Entity('tags')
export class TagsEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Field()
	title: string;

	@Column()
	@Field()
	color: string;

	@Column()
	@Field()
	createdAt: Date;

	@Field(() => [CustomerEntity], { nullable: true })
	@ManyToMany(() => CustomerEntity, (entity) => entity.tags)
	customers?: CustomerEntity[];

	@Field(() => [ServiceEntity], { nullable: true })
	@ManyToMany(() => ServiceEntity, (entity) => entity.tags)
	services?: ServiceEntity[];

	@Field(() => CompanyEntity)
	@ManyToOne(() => CompanyEntity, (entity) => entity.customers, { eager: true })
	company: CompanyEntity;

	constructor() {
		super();
		this.createdAt = new Date();
	}
}
