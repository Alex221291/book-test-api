import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ScheduleEntity } from '../schedules/schedules.entity';
import { CustomerEntity } from '../customers/customer.entity';
import generateHash from '../../base/utils/generateHash';
import { generateRandomCode } from 'src/base/utils/generateRandomCode';
import { OfficesEntity } from '../offices/offices.entity';
import { CurrencyTypes } from '../../base/types/currency.enum';
import { BookingsStatuses } from './types/bookings.statuses';
import { SubscriptionsEntity } from '../subscriptions/subscriptions.entity';
import { WebFormEntity } from '../webforms/webform.entity';
import { PaymentsEntity } from '../payments/payments.entity';

@ObjectType()
@Entity('bookings')
export class BookingEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column()
	hash: string;

	@Field(() => Boolean)
	@Column({ default: false })
	confirmed: boolean;

	@Column()
	code: string;

	/***
	 * @deprecated
	 */
	@Field(() => Float)
	@Column({ default: 0, nullable: true })
	price: number;

	@Field(() => PaymentsEntity, { nullable: true })
	@ManyToOne(() => PaymentsEntity, (entity) => entity.bookings, {
		cascade: true,
		eager: true,
	})
	payment: PaymentsEntity;

	@Field(() => BookingsStatuses)
	@Column({ length: 32, default: BookingsStatuses.PREPARED })
	status: BookingsStatuses;

	/***
	 * @deprecated
	 */
	@Field(() => CurrencyTypes)
	@Column({ length: 32, default: CurrencyTypes.BYN })
	currency: CurrencyTypes;

	@Field({ nullable: true })
	@Column({ type: 'varchar', default: null, length: 10485760 })
	comment: string;

	@Field(() => Int, { nullable: true })
	@Column({ nullable: true, default: 0 })
	remindFor: number;

	@Field(() => Int)
	@Column({ default: false, nullable: true })
	remindSent: boolean;

	@Field({ nullable: true })
	@CreateDateColumn()
	createdAt: Date;

	@Field({ nullable: true })
	@UpdateDateColumn({ nullable: true })
	updatedAt: Date;

	@Field(() => [ScheduleEntity], { nullable: true })
	@ManyToMany(() => ScheduleEntity, (entity) => entity.bookings, {
		cascade: true,
	})
	@JoinTable()
	schedules: ScheduleEntity[];

	@Field(() => OfficesEntity)
	@ManyToOne(() => OfficesEntity, (entity) => entity.bookings)
	office: OfficesEntity;

	@Field(() => WebFormEntity, { nullable: true })
	@ManyToOne(() => WebFormEntity, (entity) => entity.bookings)
	webForm: WebFormEntity;

	@Field(() => SubscriptionsEntity, { nullable: true })
	@ManyToOne(() => SubscriptionsEntity, (entity) => entity.bookings, {
		eager: true,
		cascade: true,
	})
	subscription: SubscriptionsEntity;

	@Field(() => CustomerEntity, { nullable: true })
	@ManyToOne(() => CustomerEntity, (entity) => entity.bookings, {
		eager: true,
		cascade: true,
		nullable: true,
	})
	customer: CustomerEntity;

	constructor() {
		super();
		this.createdAt = new Date();
		this.updatedAt = new Date();
		this.hash = generateHash();
		this.code = generateRandomCode().toString();
	}
}
