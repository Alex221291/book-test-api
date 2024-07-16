import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
	BaseEntity,
	Column,
	Entity,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeEntity } from '../employees/employees.entity';
import { BookingEntity } from '../bookings/bookings.entity';
import { ServiceEntity } from '../services/services.entity';
import { GroupsEntity } from '../groups/groups.entity';
import { SchedulesType } from './types/schedules.type';

@ObjectType()
@Entity('schedule')
export class ScheduleEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field(() => SchedulesType)
	@Column({ default: SchedulesType.DEFAULT })
	type: SchedulesType;

	@Column('time')
	startTime: string;

	@Column('time')
	finishTime: string;

	@Column()
	@Field()
	createdAt?: Date;

	@Column()
	@Field()
	updatedAt?: Date;

	@Column()
	@Field()
	sinceDate: Date;

	@Column()
	@Field()
	untilDate: Date;

	@Column('integer', { default: 0 })
	@Field(() => Number)
	cancelled: number;

	@Field(() => EmployeeEntity)
	@ManyToOne(() => EmployeeEntity, (entity) => entity.schedules, {
		eager: true,
	})
	employee: EmployeeEntity;

	@Field(() => [ServiceEntity], { nullable: true })
	@ManyToMany(() => ServiceEntity, (entity) => entity.schedules, {
		eager: true,
		onDelete: 'CASCADE',
	})
	services: ServiceEntity[];

	@Field(() => [BookingEntity], { nullable: true })
	@ManyToMany(() => BookingEntity, (entity) => entity.schedules, {
		eager: true,
	})
	bookings: BookingEntity[];

	@Field(() => GroupsEntity, { nullable: true })
	@ManyToOne(() => GroupsEntity, (entity) => entity.schedules, {
		eager: true,
		onDelete: 'CASCADE',
	})
	group: GroupsEntity;

	constructor() {
		super();
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}
}
