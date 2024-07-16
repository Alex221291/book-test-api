import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TelegramService {
	protected readonly logger = new Logger(TelegramService.name);
	constructor(private readonly httpService: HttpService) {}

	async send(token: string, chatId: string, message: string): Promise<boolean> {
		try {
			await firstValueFrom(
				this.httpService
					.get(
						`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
							message,
						)}`,
					)
					.pipe(),
			);
		} catch (e) {
			this.logger.warn(e.message);
		}
		return true;
	}
}
