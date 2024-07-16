import {
	BaseEntity,
	Column,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CompanyEntity } from '../companies/companies.entity';
import { EmployeeEntity } from '../employees/employees.entity';
import { BookingEntity } from '../bookings/bookings.entity';
import { GroupsEntity } from '../groups/groups.entity';
import { WebFormEntity } from '../webforms/webform.entity';
import { CustomerEntity } from '../customers/customer.entity';

@ObjectType()
@Entity('offices')
export class OfficesEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column()
	title: string;

	@Field()
	@Column()
	address: string;

	@Field()
	@Column()
	phone: string;

	@Field()
	@Column()
	workingDays: string;

	@Field(() => Boolean)
	@Column({ type: 'boolean', default: false })
	archived: boolean;

	@Field(() => CompanyEntity)
	@ManyToOne(() => CompanyEntity, (entity) => entity.offices, { eager: true })
	company: CompanyEntity;

	@Field(() => [EmployeeEntity], { nullable: true })
	@OneToMany(() => EmployeeEntity, (entity) => entity.office)
	employees?: EmployeeEntity[];

	@Field(() => [CustomerEntity], { nullable: true })
	@ManyToMany(() => CustomerEntity, (entity) => entity.offices)
	customers?: CustomerEntity[];

	@Field(() => [BookingEntity], { nullable: true })
	@OneToMany(() => BookingEntity, (entity) => entity.office)
	bookings?: BookingEntity[];

	@Field(() => [GroupsEntity], { nullable: true })
	@OneToMany(() => GroupsEntity, (entity) => entity.office)
	groups?: GroupsEntity[];

	@Field(() => [WebFormEntity], { nullable: true })
	@OneToMany(() => WebFormEntity, (entity) => entity.office)
	webForms?: WebFormEntity[];
}
