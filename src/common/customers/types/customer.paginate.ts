import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../../base/graphql-pagination/types/pagination.response.type';
import { CustomerEntity } from '../customer.entity';

@ObjectType()
class CustomerPaginatedResponse extends PaginatedResponse(CustomerEntity) {}

export default CustomerPaginatedResponse
