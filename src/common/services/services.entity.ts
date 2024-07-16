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
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { CompanyEntity } from '../companies/companies.entity';
import { EmployeeEntity } from '../employees/employees.entity';
import { ScheduleEntity } from '../schedules/schedules.entity';
import { SubscriptionsPlanEntity } from '../subscriptions/subscriptions.plan.entity';
import { GroupsEntity } from '../groups/groups.entity';
import { CurrencyTypes } from '../../base/types/currency.enum';
import { CategoriesEntity } from '../categories/categories.entity';
import { WebFormEntity } from '../webforms/webform.entity';
import { TagsEntity } from '../tags/tags.entity';

@ObjectType()
@Entity('services')
export class ServiceEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id?: number;

	@Field()
	@Column()
	title: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	description: string;

	@Field(() => Int)
	@Column()
	duration: number;

	@Field(() => Float)
	@Column({ type: 'float' })
	price: number;

	@Field(() => Float, { nullable: true })
	@Column({ type: 'float', nullable: true })
	maxPrice: number;

	@Field(() => CurrencyTypes)
	@Column({ length: 32 })
	currency: CurrencyTypes;

	@Field(() => Boolean)
	@Column({ type: 'boolean', default: false })
	archived: boolean;

	@Field(() => Int)
	@Column({ default: 0 })
	weight: number;

	@Field(() => CompanyEntity)
	@ManyToOne(() => CompanyEntity, (entity) => entity.services, { eager: true })
	company: CompanyEntity;

	@Field(() => CategoriesEntity, { nullable: true })
	@ManyToOne(() => CategoriesEntity, (entity) => entity.services, {
		eager: true,
		cascade: true,
	})
	category: CategoriesEntity;

	@Field(() => [EmployeeEntity], { nullable: true })
	@ManyToMany(() => EmployeeEntity, (entity) => entity.services, {
		eager: true,
	})
	employees?: EmployeeEntity[];

	@Field(() => [ScheduleEntity], { nullable: true })
	@ManyToMany(() => ScheduleEntity, (entity) => entity.services)
	@JoinTable()
	schedules: ScheduleEntity[];

	@Field(() => [SubscriptionsPlanEntity], { nullable: true })
	@ManyToMany(() => SubscriptionsPlanEntity, (entity) => entity.services)
	subscriptionPlans: ScheduleEntity[];

	@Field(() => [GroupsEntity], { nullable: true })
	@OneToMany(() => GroupsEntity, (entity) => entity.service)
	groups: GroupsEntity[];

	@Field(() => [WebFormEntity], { nullable: true })
	@ManyToMany(() => WebFormEntity, (entity) => entity.services)
	@JoinTable()
	webForms: WebFormEntity[];

	@Field(() => [TagsEntity], { nullable: true })
	@ManyToMany(() => TagsEntity, (entity) => entity.services, {
		eager: true,
	})
	@JoinTable()
	tags: TagsEntity[];
}
