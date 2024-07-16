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
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ServiceEntity } from '../services/services.entity';
import { ScheduleEntity } from '../schedules/schedules.entity';
import { FileEntity } from '../file/file.entity';
import { UserEntity } from '../users/users.entity';
import { OfficesEntity } from '../offices/offices.entity';
import { WebFormEntity } from '../webforms/webform.entity';

@ObjectType()
@Entity({ name: 'employees' })
export class EmployeeEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column()
	firstName: string;

	@Field()
	@Column()
	lastName: string;

	@Field(() => FileEntity, { nullable: true })
	@ManyToOne(() => FileEntity)
	photo?: FileEntity;

	@Field(() => FileEntity, { nullable: true })
	@ManyToOne(() => FileEntity)
	background?: FileEntity;

	@Field()
	@Column({ nullable: true })
	phone: string;

	@Field()
	@Column()
	jobTitle: string;

	@Field(() => Int, { nullable: true })
	@Column()
	rate?: number;

	@Field(() => Boolean)
	@Column({ type: 'boolean', default: false })
	archived: boolean;

	@Field(() => OfficesEntity, { nullable: true })
	@ManyToOne(() => OfficesEntity, (entity) => entity.employees, { eager: true })
	office: OfficesEntity;

	@Field(() => UserEntity, { nullable: true })
	@ManyToOne(() => UserEntity, (entity) => entity.employees, {
		eager: true,
		cascade: true,
	})
	user: UserEntity;

	@Field(() => [ServiceEntity], { nullable: true })
	@ManyToMany(() => ServiceEntity, (entity) => entity.employees)
	@JoinTable()
	services: ServiceEntity[];

	@Field(() => [ScheduleEntity], { nullable: true })
	@OneToMany(() => ScheduleEntity, (entity) => entity.employee)
	schedules: ScheduleEntity[];

	@Field(() => [WebFormEntity], { nullable: true })
	@ManyToMany(() => WebFormEntity, (entity) => entity.employees)
	@JoinTable()
	webForms: WebFormEntity[];
}
