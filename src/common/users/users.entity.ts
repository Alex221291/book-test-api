import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	BaseEntity,
	ManyToMany,
	JoinTable,
	OneToMany,
	ManyToOne,
} from 'typeorm';
import { CompanyEntity } from '../companies/companies.entity';
import md5 from '../../base/utils/md5';
import generateHash from 'src/base/utils/generateHash';
import { EmployeeEntity } from '../employees/employees.entity';
import { RoleTypes } from './users.role.enum';
import { UsersStatus } from './users.status.enum';
import { PlansEntity } from '../plans/plans.entity';
import { PaymentsEntity } from '../payments/payments.entity';
import parsePhoneNumber from '../../base/utils/parsePhoneNumber';

@ObjectType()
@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field({ nullable: true })
	@Column({ unique: true, nullable: true })
	email: string;

	@Field(() => Int)
	@Column({ default: false })
	confirmed: boolean;

	@Column({ nullable: true })
	hash?: string;

	@Field({ nullable: true })
	@Column({ unique: true, nullable: true })
	phone: string;

	@Field(() => Date, { nullable: true })
	@Column({ nullable: true })
	birthday: Date;

	@Field({ nullable: true })
	@Column({ default: '0.00' })
	balance: string;

	@Column()
	password: string;

	@Field()
	@Column({ default: true })
	active: boolean;

	@Field(() => RoleTypes)
	@Column({ default: RoleTypes.OWNER })
	role: RoleTypes;

	@Field(() => PlansEntity)
	@ManyToOne(() => PlansEntity, (entity) => entity.users, { eager: true })
	plan: PlansEntity;

	@Field(() => String, { nullable: true })
	@Column({ default: UsersStatus.UNCOMPLETED })
	status: string;

	/* @deprecated */
	@Column({ nullable: true })
	@Field({ nullable: true })
	paidUntil?: Date;

	@Column({ nullable: true })
	@Field({ nullable: true })
	startOf?: Date;

	@Column()
	@Field()
	createdAt: Date;

	@Column()
	@Field()
	updatedAt: Date;

	@Field(() => [CompanyEntity], { nullable: true })
	@ManyToMany(() => CompanyEntity, (company) => company.users)
	@JoinTable()
	companies: CompanyEntity[];

	@Field(() => [EmployeeEntity], { nullable: true })
	@OneToMany(() => EmployeeEntity, (entity) => entity.user)
	employees?: EmployeeEntity[];

	@Field(() => [PaymentsEntity], { nullable: true })
	@OneToMany(() => PaymentsEntity, (entity) => entity.user)
	payments: PaymentsEntity[];

	constructor(phone = '', plainPassword = '') {
		super();
		this.phone = parsePhoneNumber(phone);
		this.password = md5(plainPassword);
		this.hash = generateHash();
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}
}
