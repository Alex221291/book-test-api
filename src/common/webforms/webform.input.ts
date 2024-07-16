import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { WebFormEntity } from './webform.entity';

@InputType('WebFormInput')
export class WebFormInput extends PartialType(WebFormEntity) {
	@Field()
	title: string;

	@Field()
	type: string;

	@Field()
	hash: string;

	@Field({ nullable: true })
	description: string;

	@Field(() => Boolean, { nullable: true })
	pinProtection: boolean;

	@Field(() => Boolean, { nullable: true })
	isProtected: boolean;

	@Field(() => Boolean, { nullable: true })
	firstStepHidden: boolean;

	@Field(() => Int)
	delay: number;

	@Field(() => Int)
	pitch: number;

	@Field(() => Int)
	maxAppointmentPeriod: number;

	@Field(() => Int)
	officeId: number;

	@Field(() => [Int])
	serviceIds: Array<number>;

	@Field(() => [Int])
	employeeIds: Array<number>;
}
