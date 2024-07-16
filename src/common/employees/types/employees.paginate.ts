import { EmployeeEntity } from '../employees.entity';
import PaginatedResponse from '../../../base/graphql-pagination/types/pagination.response.type';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
class EmployeesPaginatedResponse extends PaginatedResponse(EmployeeEntity) {}

export default EmployeesPaginatedResponse;
