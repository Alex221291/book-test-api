import { BaseService } from '../../base/base.service';
import { PaymentsEntity } from './payments.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PaymentPayloadType } from './types/PaymentPayloadType';
export declare class PaymentsService extends BaseService<PaymentsEntity> {
    protected repository: Repository<PaymentsEntity>;
    private readonly usersService;
    constructor(repository: Repository<PaymentsEntity>, usersService: UsersService);
    preparePayment(payload: PaymentPayloadType, currency?: string, conversion?: number): Promise<PaymentsEntity>;
}
