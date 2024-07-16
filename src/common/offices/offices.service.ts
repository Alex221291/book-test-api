import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { OfficesEntity } from './offices.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';

@Injectable()
export class OfficesService extends BaseService<OfficesEntity> {
	constructor(
		@InjectRepository(OfficesEntity)
		protected repository: Repository<OfficesEntity>,
	) {
		super();
	}

	async getOfficeWorkTime(officeId: number, date: DateTime) {
		const regExp = /^([0-9]{2})([0-9]{2})/;
		const day = date.toFormat('ccc');
		const office = await this.findOneBy({
			id: officeId,
		});
		if (office?.workingDays) {
			const workDays = JSON.parse(office.workingDays);
			const workTime = workDays[day];
			if (workTime) {
				const from = workTime.from.replace(regExp, '$1.$2').split('.');
				const to = workTime.to.replace(regExp, '$1.$2').split('.');
				const startWorkDateTime = date.setZone(office.company.timezone).set({
					hour: from[0],
					minute: from[1],
					second: 0,
					millisecond: 0,
				});
				const finishWorkDateTime = date.setZone(office.company.timezone).set({
					hour: to[0],
					minute: to[1],
					second: 0,
					millisecond: 0,
				});
				return [startWorkDateTime, finishWorkDateTime];
			}
			return [null, null];
		}
		throw new NotFoundException('working.hours.not.configured');
	}
}
