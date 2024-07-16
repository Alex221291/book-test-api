import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
	BaseEntity,
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceEntity } from '../services/services.entity';
import { CompanyEntity } from '../companies/companies.entity';
import { SubscriptionsEntity } from './subscriptions.entity';
import { CurrencyTypes } from '../../base/types/currency.enum';

@ObjectType()
@Entity('subscription_plans')
export class SubscriptionsPlanEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column()
	title: string;

	@Field(() => Float)
	@Column()
	price: number;

	@Field(() => CurrencyTypes)
	@Column({ length: 32 })
	currency: CurrencyTypes;

	@Field(() => Int)
	@Column()
	validity: number;

	@Field()
	@Column({ length: 32 })
	unit: string;

	@Field()
	@Column({ length: 64 })
	activationType: string;

	@Field(() => Int)
	@Column()
	visits: number;

	@Field(() => Boolean)
	@Column({ type: 'boolean', default: false })
	archived: boolean;

	@Column()
	@Field()
	createdAt: Date;

	@Column()
	@Field()
	updatedAt: Date;

	@Field(() => [ServiceEntity])
	@ManyToMany(() => ServiceEntity, (entity) => entity.subscriptionPlans, {
		eager: true,
	})
	@JoinTable()
	services: ServiceEntity[];

	@Field(() => CompanyEntity, { nullable: true })
	@ManyToOne(() => CompanyEntity, (entity) => entity.subscriptionPlans, {
		eager: true,
	})
	company: CompanyEntity;

	@Field(() => [SubscriptionsEntity], { nullable: true })
	@OneToMany(() => SubscriptionsEntity, (entity) => entity.plan)
	subscriptions?: SubscriptionsEntity[];

	constructor() {
		super();
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}
}
