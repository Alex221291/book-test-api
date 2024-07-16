import { Field, Int, ObjectType } from '@nestjs/graphql';
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
import { BookingEntity } from '../bookings/bookings.entity';
import { SubscriptionsEntity } from '../subscriptions/subscriptions.entity';
import { GroupsCustomersEntity } from '../groups/groups.customers.entity';
import { OfficesEntity } from '../offices/offices.entity';
import { CompanyEntity } from '../companies/companies.entity';
import { TagsEntity } from '../tags/tags.entity';
import { Expose } from 'class-transformer';
import { RoleTypes } from '../users/users.role.enum';

@ObjectType()
@Entity({ name: 'customers' })
export class CustomerEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field({ nullable: true })
	@Column({ unique: false })
	@Expose({
		groups: [
			RoleTypes.OWNER,
			RoleTypes.ADMIN_EXTERNAL,
			RoleTypes.EMPLOYEE_EXTERNAL,
		],
	})
	phone: string;

	@Field({ nullable: true, defaultValue: '' })
	@Column({ nullable: true, default: '' })
	firstName?: string;

	@Field({ nullable: true, defaultValue: '' })
	@Column({ nullable: true, default: '' })
	lastName: string;

	/**
	 * @deprecated
	 */
	@Field({ nullable: true })
	@Column({ nullable: true })
	loyalty: string;

	@Field()
	@Column({ default: 0 })
	blocked: number;

	@Field({ nullable: true })
	@Column({ nullable: true })
	birthday: Date;

	@Field({ nullable: true })
	@Column({ nullable: true, length: 2 })
	gender: string;

	@Field({ nullable: true })
	@Column({ nullable: true, type: 'varchar', length: 10485760 })
	notes: string;

	@Field(() => Boolean)
	@Column({ type: 'boolean', default: false })
	archived: boolean;

	@Field({ nullable: true })
	@Column({ nullable: true, default: () => 'CURRENT_TIMESTAMP' })
	createdAt?: Date;

	@Field({ nullable: true })
	@Column({ nullable: true, default: () => 'CURRENT_TIMESTAMP' })
	updatedAt?: Date;

	@Field(() => CompanyEntity)
	@ManyToOne(() => CompanyEntity, (entity) => entity.customers, { eager: true })
	company: CompanyEntity;

	@Field(() => [BookingEntity], { nullable: true })
	@OneToMany(() => BookingEntity, (entity) => entity.customer)
	bookings?: BookingEntity[];

	@Field(() => [SubscriptionsEntity], { nullable: true })
	@OneToMany(() => SubscriptionsEntity, (entity) => entity.customer)
	subscriptions?: SubscriptionsEntity[];

	@Field(() => [GroupsCustomersEntity], { nullable: true })
	@OneToMany(() => GroupsCustomersEntity, (entity) => entity.group)
	groups?: GroupsCustomersEntity[];

	@Field(() => [TagsEntity], { nullable: true })
	@ManyToMany(() => TagsEntity, (entity) => entity.customers, {
		eager: true,
	})
	@JoinTable()
	tags: TagsEntity[];

	/**
	 * @deprecated
	 */
	@Field(() => [OfficesEntity], { nullable: true })
	@ManyToMany(() => OfficesEntity, (entity) => entity.customers, {
		eager: true,
	})
	@JoinTable()
	offices: OfficesEntity[];

	constructor() {
		super();
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}
}
