import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SMSSenderA1Service {
	protected readonly logger = new Logger(SMSSenderA1Service.name);
	constructor(private readonly httpService: HttpService) {}

	async sendSMS(
		user: string,
		apikey: string,
		msisdn: string,
		text: string,
		extra = {},
	) {
		try {
			const { data } = await firstValueFrom(
				this.httpService
					.get('https://smart-sender.a1.by/api/send/sms', {
						params: {
							user,
							apikey,
							msisdn,
							text,
							...extra,
						},
					})
					.pipe(),
			);
			if (data?.error) {
				this.logger.warn(data.error?.description);
			}
		} catch (e) {
			this.logger.warn(e.message);
		}
		return true;
	}
}
