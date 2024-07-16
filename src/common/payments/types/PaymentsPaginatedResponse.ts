import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../../base/graphql-pagination/types/pagination.response.type';
import { PaymentsEntity } from '../payments.entity';

@ObjectType()
class PaymentsPaginatedResponse extends PaginatedResponse(PaymentsEntity) {}

export default PaymentsPaginatedResponse;
