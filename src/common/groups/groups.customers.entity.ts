import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
	BaseEntity,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupsEntity } from './groups.entity';
import { CustomerEntity } from '../customers/customer.entity';

@ObjectType()
@Entity('groups_customers')
export class GroupsCustomersEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field(() => GroupsEntity, { nullable: true })
	@ManyToOne(() => GroupsEntity, (entity) => entity.customers, {
		eager: true,
	})
	group: GroupsEntity;

	@Field(() => CustomerEntity, { nullable: true })
	@ManyToOne(() => CustomerEntity, (entity) => entity.groups, {
		eager: true,
		cascade: true,
	})
	customer: CustomerEntity;
}
