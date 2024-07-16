import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './common/users/users.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CompaniesModule } from './common/companies/companies.module';
import { ServicesModule } from './common/services/services.module';
import { EmployeesModule } from './common/employees/employees.module';
import { SchedulesModule } from './common/schedules/schedules.module';
import { BookingsModule } from './common/bookings/bookings.module';
import { CustomerModule } from './common/customers/customer.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { FileModule } from './common/file/file.module';
import { ConfigModule } from '@nestjs/config';
import { AnalyticsModule } from './common/analytics/analytics.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { IntegrationsModule } from './common/integrations/integrations.module';
import { WebFormModule } from './common/webforms/webform.module';
import { BackofficeModule } from './backoffice/backoffice.module';
import { NotificationsModule } from './common/notifications/notifications.module';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { SubscriptionsModule } from './common/subscriptions/subscriptions.module';
import { GroupsModule } from './common/groups/groups.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OfficesModule } from './common/offices/offices.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { GqlThrottlerGuard } from './app.gql-throttler.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './common/categories/categories.module';
import { PlansModule } from './common/plans/plans.module';
import { PaymentsModule } from './common/payments/payments.module';
import { TagsModule } from './common/tags/tags.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
	imports: [
		ThrottlerModule.forRoot({
			ttl: 30,
			limit: 30,
		}),
		ScheduleModule.forRoot(),
		EventEmitterModule.forRoot(),
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env', '.env.prod', '.env.dev', '.env.default'],
		}),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			debug: process.env.NODE_ENV === 'development',
			playground: process.env.NODE_ENV === 'development',
			autoSchemaFile: true,
			cache: 'bounded',
			subscriptions: {
				'graphql-ws': true,
				'subscriptions-transport-ws': true,
			},
			context: (ctx) => ctx,
		}),
		I18nModule.forRoot({
			fallbackLanguage: 'ru',
			loaderOptions: {
				path: __dirname + '/i18n/',
				watch: true,
			},
			resolvers: [AcceptLanguageResolver],
		}),
		TypeOrmModule.forRootAsync({
			useFactory: () => ({
				type: 'postgres',
				url: process.env.DATABASE_URL,
				ssl: true,
				//database: process.env.POSTGRESQL_DATABASE,
				//host: process.env.SQL_HOST,
				//port: 5432,
				//username: process.env.POSTGRESQL_USERNAME,
				//password: process.env.POSTGRESQL_PASSWORD,
				entities: ['dist/**/*.entity{.ts,.js}'],
				migrations: ['dist/migrations/*{.ts,.js}'],
				synchronize: true,
			}),
		}),
		BackofficeModule,
		AuthModule,
		UsersModule,
		CompaniesModule,
		ServicesModule,
		EmployeesModule,
		WebFormModule,
		BookingsModule,
		SchedulesModule,
		CustomerModule,
		FileModule,
		AnalyticsModule,
		IntegrationsModule,
		NotificationsModule,
		SubscriptionsModule,
		GroupsModule,
		OfficesModule,
		CategoriesModule,
		PlansModule,
		PaymentsModule,
		TagsModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: GqlThrottlerGuard,
		},
	],
})
export class AppModule {}
