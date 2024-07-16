import {
	BaseEntity,
	Column,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ServiceEntity } from '../services/services.entity';
import { CustomerEntity } from '../customers/customer.entity';
import generateHash from '../../base/utils/generateHash';
import { IntegrationsEntity } from '../integrations/integrations.entity';
import { FileEntity } from '../file/file.entity';
import { SubscriptionsPlanEntity } from '../subscriptions/subscriptions.plan.entity';
import { OfficesEntity } from '../offices/offices.entity';
import { CategoriesEntity } from '../categories/categories.entity';
import { NotificationsEntity } from '../notifications/notifications.entity';
import { TagsEntity } from '../tags/tags.entity';

@ObjectType()
@Entity('companies')
export class CompanyEntity extends BaseEntity {
	@Field(() => Int, { nullable: true })
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column({ nullable: false })
	title: string;

	@Field()
	@Column()
	address: string;

	@Field()
	@Column()
	regNumber: string;

	@Field(() => FileEntity, { nullable: true })
	@ManyToOne(() => FileEntity)
	logo: FileEntity;

	@Field({ nullable: true })
	@Column({ nullable: true })
	description?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	phone: string;

	@Field()
	@Column()
	timezone: string;

	@Field()
	@Column()
	createdAt: Date;

	@Field({ nullable: true })
	@Column({ nullable: true })
	updatedAt?: Date;

	@Field()
	@Column({ unique: true })
	hash: string;

	@ManyToMany(() => UserEntity, (user) => user.companies)
	users: UserEntity[];

	@OneToMany(() => ServiceEntity, (entity) => entity.company)
	services: ServiceEntity[];

	@OneToMany(() => CategoriesEntity, (entity) => entity.company)
	categories: CategoriesEntity[];

	@OneToMany(() => IntegrationsEntity, (entity) => entity.company)
	integrations?: IntegrationsEntity[];

	@OneToMany(() => SubscriptionsPlanEntity, (entity) => entity.company)
	subscriptionPlans?: SubscriptionsPlanEntity[];

	@OneToMany(() => OfficesEntity, (entity) => entity.company)
	offices?: OfficesEntity[];

	@OneToMany(() => CustomerEntity, (entity) => entity.company)
	customers?: CustomerEntity[];

	@OneToMany(() => TagsEntity, (entity) => entity.company)
	tags?: TagsEntity[];

	@OneToMany(() => NotificationsEntity, (entity) => entity.company)
	notifications: NotificationsEntity[];

	constructor() {
		super();
		this.createdAt = new Date();
		this.updatedAt = new Date();
		this.hash = generateHash();
	}
}
