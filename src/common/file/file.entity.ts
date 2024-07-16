import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('files')
export class FileEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column({ unique: true })
	filename: string;

	@Field()
	@Column()
	dir: string;

	@Field(() => Int)
	@Column()
	size: number;

	@Field()
	@Column()
	type: string;

	@Field()
	@Column()
	createdAt: Date;

	constructor() {
		super();
		this.createdAt = new Date();
	}
}
