import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ScheduleInput } from '../../schedules/schedules.input';

@InputType('BookingSimpleInput')
export class BookingSimpleInput {
	@Field(() => Int)
	@IsNotEmpty()
	office: number;

	@Field(() => String, { nullable: true })
	phone?: string;

	@Field(() => String, { nullable: true })
	name?: string;

	@Field(() => String, { nullable: true })
	comment?: string;

	@Field(() => Int, { nullable: true })
	remindFor: number;

	@Field(() => ScheduleInput)
	@IsNotEmpty()
	schedule: ScheduleInput;
}
