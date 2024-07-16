import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { ScheduleEntity } from '../schedules/schedules.entity';
import { ServiceEntity } from '../services/services.entity';
import { OfficesEntity } from '../offices/offices.entity';
import { GroupsCustomersEntity } from './groups.customers.entity';

@ObjectType()
@Entity('groups')
export class GroupsEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Field()
	title: string;

	@Column()
	@Field()
	sinceDate: Date;

	@Column()
	@Field()
	untilDate: Date;

	@Field(() => Boolean)
	@Column({ type: 'boolean', default: false })
	archived: boolean;

	@Field(() => ServiceEntity)
	@ManyToOne(() => ServiceEntity, (entity) => entity.groups)
	service: ServiceEntity;

	@Field(() => OfficesEntity)
	@ManyToOne(() => OfficesEntity, (entity) => entity.groups)
	office: OfficesEntity;

	@Field(() => [GroupsCustomersEntity], { nullable: true })
	@OneToMany(() => GroupsCustomersEntity, (entity) => entity.group)
	customers?: GroupsCustomersEntity[];

	@Field(() => [ScheduleEntity], { nullable: true })
	@OneToMany(() => ScheduleEntity, (entity) => entity.group, {
		cascade: true,
	})
	schedules: ScheduleEntity[];
}
