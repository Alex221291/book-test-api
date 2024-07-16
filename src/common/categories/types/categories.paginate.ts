import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../../base/graphql-pagination/types/pagination.response.type';
import { CategoriesEntity } from '../categories.entity';

@ObjectType()
class CategoriesPaginatedResponse extends PaginatedResponse(CategoriesEntity) {}

export default CategoriesPaginatedResponse;
