import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../../base/graphql-pagination/types/pagination.response.type';
import { BookingEntity } from '../bookings.entity';

@ObjectType()
class BookingPaginatedResponse extends PaginatedResponse(BookingEntity) {}

export default BookingPaginatedResponse;
