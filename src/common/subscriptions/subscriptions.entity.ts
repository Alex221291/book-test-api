import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { SubscriptionsPlanEntity } from './subscriptions.plan.entity';
import { CustomerEntity } from '../customers/customer.entity';
import { BookingEntity } from '../bookings/bookings.entity';
import { PaymentsEntity } from '../payments/payments.entity';

@ObjectType()
@Entity('subscriptions')
export class SubscriptionsEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	@Field({ nullable: true })
	firstVisit?: Date;

	@Column()
	@Field()
	sinceDate: Date;

	@Column()
	@Field()
	untilDate: Date;

	@Column()
	@Field()
	createdAt: Date;

	@Field(() => Boolean)
	@Column({ type: 'boolean', default: false })
	archived: boolean;

	@Field(() => PaymentsEntity, { nullable: true })
	@ManyToOne(() => PaymentsEntity, (entity) => entity.subscriptions, {
		cascade: true,
		eager: true,
	})
	payment: PaymentsEntity;

	@Field(() => CustomerEntity)
	@ManyToOne(() => CustomerEntity, (entity) => entity.subscriptions, {
		eager: true,
		cascade: true,
	})
	customer: CustomerEntity;

	@Field(() => SubscriptionsPlanEntity, { nullable: true })
	@ManyToOne(() => SubscriptionsPlanEntity, (entity) => entity.subscriptions, {
		eager: true,
	})
	plan: SubscriptionsPlanEntity;

	@Field(() => [BookingEntity], { nullable: true })
	@OneToMany(() => BookingEntity, (entity) => entity.subscription)
	bookings?: BookingEntity[];

	constructor() {
		super();
		this.createdAt = new Date();
	}
}
