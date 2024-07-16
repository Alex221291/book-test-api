import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CompanyEntity } from '../companies/companies.entity';
import { IntegrationsType } from './integrations.type';
import { IntegrationsProviderType } from './integrations.provider.type';

@ObjectType()
@Entity('integrations')
export class IntegrationsEntity extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field(() => IntegrationsType)
	@Column()
	type: IntegrationsType;

	@Field(() => IntegrationsProviderType)
	@Column()
	provider: IntegrationsProviderType;

	@Field()
	@Column('text')
	config: string;

	@Field(() => CompanyEntity)
	@ManyToOne(() => CompanyEntity, (entity) => entity.integrations, {
		eager: true,
	})
	company: CompanyEntity;
}
