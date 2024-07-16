import { Field, Int, ObjectType } from '@nestjs/graphql';
import PaginatedResponseInterface from './pagination.response.interface';
import { ClassType } from '../../types/class.type';

export default function PaginatedResponse<TItem>(
	TItemClass: ClassType<TItem>,
): ClassType<PaginatedResponseInterface<TItem>> {
	@ObjectType({ isAbstract: true })
	class PaginatedResponseClass implements PaginatedResponseInterface<TItem> {
		constructor(items: TItem[], total: number, offset: number, limit: number) {
			this.items = items;
			this.total = total;
			this.offset = offset;
			this.limit = limit;
		}
		@Field(() => [TItemClass])
		items: TItem[];
		@Field(() => Int)
		total: number;
		@Field(() => Int, { nullable: true, defaultValue: 0 })
		offset: number;
		@Field(() => Int, { nullable: true, defaultValue: 20 })
		limit: number;
	}
	return PaginatedResponseClass;
}
