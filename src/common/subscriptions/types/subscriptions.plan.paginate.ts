import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../../base/graphql-pagination/types/pagination.response.type';
import { SubscriptionsPlanEntity } from '../subscriptions.plan.entity';

@ObjectType()
class SubscriptionsPlanPaginatedResponse extends PaginatedResponse(
	SubscriptionsPlanEntity,
) {}

export default SubscriptionsPlanPaginatedResponse;
