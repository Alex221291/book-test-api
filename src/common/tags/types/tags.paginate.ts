import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../../base/graphql-pagination/types/pagination.response.type';
import { TagsEntity } from '../tags.entity';

@ObjectType()
class TagsPaginatedResponse extends PaginatedResponse(TagsEntity) {}

export default TagsPaginatedResponse;
