import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../../base/graphql-pagination/types/pagination.response.type';
import { GroupsEntity } from '../groups.entity';

@ObjectType()
class GroupsPaginatedResponse extends PaginatedResponse(GroupsEntity) {}

export default GroupsPaginatedResponse;
