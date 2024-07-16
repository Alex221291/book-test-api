import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../../base/graphql-pagination/types/pagination.response.type';
import { OfficesEntity } from '../offices.entity';

@ObjectType()
class OfficesPaginatedResponse extends PaginatedResponse(OfficesEntity) {}

export default OfficesPaginatedResponse;
