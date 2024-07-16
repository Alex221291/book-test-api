import { BaseService } from '../../base/base.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BookingEntity } from './bookings.entity';
import { BookingInput } from './dto/bookings.input';
import { UserEntity } from '../users/users.entity';
import { OfficesService } from '../offices/offices.service';
import { CustomerService } from '../customers/customer.service';
import { ScheduleService } from '../schedules/schedules.service';
export declare class BookingsService extends BaseService<BookingEntity> {
    protected repository: Repository<BookingEntity>;
    private readonly officesService;
    private readonly customerService;
    private readonly scheduleService;
    constructor(repository: Repository<BookingEntity>, officesService: OfficesService, customerService: CustomerService, scheduleService: ScheduleService);
    prepare(entity: BookingEntity, payload: BookingInput, user: UserEntity): Promise<BookingEntity>;
    getBookingById(hash: string, user: UserEntity): Promise<BookingEntity>;
    getSelectQueryBuilder(parent?: SelectQueryBuilder<BookingEntity>): SelectQueryBuilder<BookingEntity>;
}
