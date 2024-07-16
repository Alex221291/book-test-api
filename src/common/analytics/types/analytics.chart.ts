import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class AnalyticsChart {
	@Field()
	label: string;
	@Field()
	value: number;
	@Field({ nullable: true })
	type?: string;
}

export default AnalyticsChart;
