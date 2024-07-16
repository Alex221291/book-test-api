import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { PaymentsEntity } from './payments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PaymentPayloadType } from './types/PaymentPayloadType';
import { RoleTypes } from '../users/users.role.enum';

@Injectable()
export class PaymentsService extends BaseService<PaymentsEntity> {
	constructor(
		@InjectRepository(PaymentsEntity)
		protected repository: Repository<PaymentsEntity>,
		private readonly usersService: UsersService,
	) {
		super();
	}

	async preparePayment(
		payload: PaymentPayloadType,
		currency = 'BYN',
		conversion = 1.0,
	) {
		const { userId, amount, account_key, details, type, purpose } = payload;
		const lastPayment = await this.findOneBy(
			{
				account_key,
				user: {
					id: userId,
				},
			},
			{},
			{
				id: 'desc',
			},
		);
		const user = await this.usersService.findOneBy({
			id: userId,
			role: RoleTypes.OWNER,
		});
		const balance =
			account_key === 'account'
				? Number(lastPayment?.balance || user.balance)
				: Number(lastPayment?.balance || 0);
		const entity = new PaymentsEntity();
		entity.user = user;

		entity.type = type;
		entity.account_key = account_key;
		entity.purpose = purpose;
		entity.details = details;

		entity.amount = amount.toString();
		entity.conversionRate = conversion.toString();
		entity.currency = currency;
		entity.total = (amount * conversion).toString();

		if (type === 'outcoming') {
			entity.balance = (balance - Number(entity.total)).toString();
		} else if (type === 'incoming') {
			entity.balance = (balance + Number(entity.total)).toString();
		}

		return entity;
	}
}
