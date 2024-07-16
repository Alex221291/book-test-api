import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
	BaseEntity,
	Column,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import generateHash from '../../base/utils/generateHash';
import { OfficesEntity } from '../offices/offices.entity';
import { EmployeeEntity } from '../employees/employees.entity';
import { ServiceEntity } from '../services/services.entity';
import { BookingEntity } from '../bookings/bookings.entity';

@ObjectType()
@Entity('forms')
export class WebFormEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column()
	title: string;

	@Field()
	@Column()
	type: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	description: string;

	@Field()
	@Column()
	createdAt: Date;

	@Field()
	@Column()
	updatedAt: Date;

	@Field()
	@Column({ unique: true })
	hash: string;

	@Field()
	@Column({ type: 'boolean', default: false })
	pinProtection: boolean;

	@Field()
	@Column({ type: 'boolean', default: false })
	isProtected: boolean;

	@Field(() => Boolean)
	@Column({ type: 'boolean', default: false })
	archived: boolean;

	@Field(() => Int)
	@Column({ default: 60 })
	delay: number;

	@Field(() => Int)
	@Column({ default: 15 })
	pitch: number;

	@Field()
	@Column({ type: 'boolean', default: false })
	firstStepHidden: boolean;

	@Column('integer', { default: 30 })
	@Field(() => Number)
	maxAppointmentPeriod: number;

	@Field(() => OfficesEntity)
	@ManyToOne(() => OfficesEntity, (entity) => entity.webForms, { eager: true })
	office: OfficesEntity;

	@Field(() => [EmployeeEntity], { nullable: true })
	@ManyToMany(() => EmployeeEntity, (entity) => entity.webForms, {
		eager: true,
	})
	employees: EmployeeEntity[];

	@Field(() => [ServiceEntity], { nullable: true })
	@ManyToMany(() => ServiceEntity, (entity) => entity.webForms)
	services: ServiceEntity[];

	@Field(() => [BookingEntity], { nullable: true })
	@OneToMany(() => BookingEntity, (entity) => entity.office)
	bookings: BookingEntity[];

	constructor() {
		super();
		this.createdAt = new Date();
		this.updatedAt = new Date();
		this.hash = generateHash();
	}
}
