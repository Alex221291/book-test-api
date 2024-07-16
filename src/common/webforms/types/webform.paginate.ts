import PaginatedResponse from '../../../base/graphql-pagination/types/pagination.response.type';
import { ObjectType } from '@nestjs/graphql';
import { WebFormEntity } from '../webform.entity';

@ObjectType()
class WebFormPaginatedResponse extends PaginatedResponse(WebFormEntity) {}

export default WebFormPaginatedResponse;
