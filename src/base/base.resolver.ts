import { Args, Int, Mutation, Query } from '@nestjs/graphql';
import { BaseEntity } from './base.entity';
import { BaseServiceInterface } from './base.service.interface';

export class BaseResolver<T> {
	constructor(protected service: BaseServiceInterface<T>) {}

	@Mutation(
		() => {
			return BaseEntity<T>;
		},
		{ name: 'addMutation' },
	)
	async add(@Args('entity') entity: BaseEntity<T>) {
		return this.service.add(entity);
	}

	@Mutation(() => BaseEntity<T>)
	async update(@Args('entity') entity: BaseEntity<T>) {
		return this.service.update(entity);
	}

	@Mutation(() => BaseEntity<T>)
	async remove(@Args('id', { type: () => Int }) id: number) {
		return this.service.remove(id);
	}

	@Query(() => [BaseEntity<T>], { name: 'getQuery' })
	async getAll() {
		return this.service.findAll();
	}
}
