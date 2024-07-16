import { Module } from '@nestjs/common';
import { SMSSenderA1Service } from './sms-sender-a1.service';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [HttpModule],
	providers: [SMSSenderA1Service],
})
export class SMSSenderA1Module {}
