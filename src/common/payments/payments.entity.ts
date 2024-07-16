import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { BookingEntity } from '../bookings/bookings.entity';
import { SubscriptionsEntity } from '../subscriptions/subscriptions.entity';

@ObjectType()
@Entity('payments')
export class PaymentsEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	/**
	 * incoming, outcoming
	 */
	@Field()
	@Column()
	type: string;

	/**
	 * balance, orders, ...
	 */
	@Field()
	@Column()
	account_key: string;

	/**
	 * booking.add.payment, booking.close.payment, ...
	 */
	@Field()
	@Column()
	purpose: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	details?: string;

	@Field()
	@Column()
	amount: string;

	@Field()
	@Column()
	currency: string;

	@Field()
	@Column({ default: '1' })
	conversionRate: string;

	@Field()
	@Column()
	total: string;

	@Field()
	@Column()
	balance: string;

	@Field()
	@Column()
	createdAt: Date;

	@Field(() => UserEntity)
	@ManyToOne(() => UserEntity, (entity) => entity.payments)
	user: UserEntity;

	@Field(() => [BookingEntity], { nullable: true })
	@OneToMany(() => BookingEntity, (entity) => entity.payment)
	bookings?: BookingEntity[];

	@Field(() => [SubscriptionsEntity], { nullable: true })
	@OneToMany(() => SubscriptionsEntity, (entity) => entity.payment)
	subscriptions?: SubscriptionsEntity[];

	constructor() {
		super();
		this.createdAt = new Date();
	}
}
