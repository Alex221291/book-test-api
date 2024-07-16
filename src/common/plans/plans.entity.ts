import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { CurrencyTypes } from '../../base/types/currency.enum';
import { UserEntity } from '../users/users.entity';

@ObjectType()
@Entity('plans')
export class PlansEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column()
	title: string;

	@Field()
	@Column()
	code: string;

	@Field(() => Int)
	@Column({ default: 1 })
	level: number;

	@Field(() => Int)
	@Column()
	ordersLimit: number;

	@Field(() => Float)
	@Column({ type: 'double precision' })
	profit: number;

	@Field(() => Float)
	@Column({ type: 'double precision' })
	superProfit: number;

	@Field()
	@Column({ length: 32, default: CurrencyTypes.BYN })
	currency: CurrencyTypes;

	@OneToMany(() => UserEntity, (entity) => entity.plan)
	users: UserEntity[];
}
