import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../../base/graphql-pagination/types/pagination.response.type';
import { SubscriptionsEntity } from '../subscriptions.entity';

@ObjectType()
class SubscriptionsPaginatedResponse extends PaginatedResponse(
	SubscriptionsEntity,
) {}

export default SubscriptionsPaginatedResponse;
