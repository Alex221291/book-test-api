import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ScheduleInput } from '../schedules/schedules.input';

@InputType('BookingsWebFormInput')
export class BookingsWebFormInput {
	@Field(() => Int)
	@IsNotEmpty()
	office: number;

	@Field()
	@IsNotEmpty()
	name: string;

	@Field()
	@IsNotEmpty()
	phone: string;

	@Field(() => String, { nullable: true })
	comment?: string;

	@Field(() => Int, { nullable: true })
	remindFor?: number;

	@Field(() => [ScheduleInput])
	@IsNotEmpty()
	schedules: Array<ScheduleInput>;
}
