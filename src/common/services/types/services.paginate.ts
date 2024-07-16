import PaginatedResponse from '../../../base/graphql-pagination/types/pagination.response.type';
import { ObjectType } from '@nestjs/graphql';
import { ServiceEntity } from '../services.entity';

@ObjectType()
class ServicesPaginatedResponse extends PaginatedResponse(ServiceEntity) {}

export default ServicesPaginatedResponse;
