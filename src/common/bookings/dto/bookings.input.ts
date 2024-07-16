import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { BookingEntity } from '../bookings.entity';

@InputType('BookingInput')
export class BookingInput extends PartialType(BookingEntity) {
	@Field(() => Int)
	@IsNotEmpty()
	officeId: number;

	@Field(() => String, { nullable: true })
	customerPhone: string;

	@Field(() => String, { nullable: true })
	customerFirstName: string;

	@Field(() => String, { nullable: true })
	customerLastName: string;

	@Field(() => String, { nullable: true })
	comment: string;

	@Field(() => Int, { nullable: true })
	remindFor: number;

	@Field(() => [Int], { nullable: true })
	scheduleIds?: Array<number>;
}
