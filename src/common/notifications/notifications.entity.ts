import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyEntity } from '../companies/companies.entity';

@ObjectType()
@Entity('notifications')
export class NotificationsEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column()
	type: string;

	@Field()
	@Column()
	message: string;

	@Field()
	@Column({ type: 'boolean', default: false })
	read: boolean;

	@Field()
	@Column()
	json: string;

	@Field()
	@Column()
	createdAt: Date;

	@Field(() => CompanyEntity)
	@ManyToOne(() => CompanyEntity, (entity) => entity.notifications, {
		eager: true,
	})
	company: CompanyEntity;

	constructor() {
		super();
		this.createdAt = new Date();
	}
}
