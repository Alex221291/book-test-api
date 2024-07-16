import { AdminModule } from '@adminjs/nestjs';
import * as AdminJSTypeorm from '@adminjs/typeorm';
import { Module } from '@nestjs/common';
import AdminJS from 'adminjs';
import { BookingEntity } from '../common/bookings/bookings.entity';
import { CategoriesEntity } from '../common/categories/categories.entity';
import { CompanyEntity } from '../common/companies/companies.entity';
import { CustomerEntity } from '../common/customers/customer.entity';
import { EmployeeEntity } from '../common/employees/employees.entity';
import { FileEntity } from '../common/file/file.entity';
import { GroupsEntity } from '../common/groups/groups.entity';
import { IntegrationsEntity } from '../common/integrations/integrations.entity';
import { OfficesEntity } from '../common/offices/offices.entity';
import { PaymentsEntity } from '../common/payments/payments.entity';
import { PlansEntity } from '../common/plans/plans.entity';
import { ScheduleEntity } from '../common/schedules/schedules.entity';
import { ServiceEntity } from '../common/services/services.entity';
import { SubscriptionsEntity } from '../common/subscriptions/subscriptions.entity';
import { SubscriptionsPlanEntity } from '../common/subscriptions/subscriptions.plan.entity';
import { UserEntity } from '../common/users/users.entity';
import { WebFormEntity } from '../common/webforms/webform.entity';

AdminJS.registerAdapter({
	Resource: AdminJSTypeorm.Resource,
	Database: AdminJSTypeorm.Database,
});

const DEFAULT_ADMIN = {
	email: 'stasik2015@yandex.ru',
	password: 'Ujpb&6?Dq{Oy]VRW@|XO8g/I',
};

const authenticate = async (email: string, password: string) => {
	if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
		return Promise.resolve(DEFAULT_ADMIN);
	}
	return null;
};

@Module({
	imports: [
		AdminModule.createAdminAsync({
			useFactory: () => {
				return ({
					adminJsOptions: {
						rootPath: '/capmoxi',
						loginPath: '/capmoxi/login',
						logoutPath: '/capmoxi/logout',
						resources: [
							FileEntity,
							EmployeeEntity,
							CompanyEntity,
							UserEntity,
							CustomerEntity,
							BookingEntity,
							ScheduleEntity,
							ServiceEntity,
							WebFormEntity,
							OfficesEntity,
							SubscriptionsEntity,
							CategoriesEntity,
							SubscriptionsPlanEntity,
							GroupsEntity,
							IntegrationsEntity,
							PlansEntity,
							PaymentsEntity,
						],
					},
					auth: {
						authenticate,
						cookieName: 'capmoxi',
						cookiePassword: '~=/SxY!E3~.E&crz1aW_Bm.,',
					},
					sessionOptions: {
						resave: true,
						saveUninitialized: true,
						secret: '~=/SxY!E3~.E&crz1aW_Bm.,',
					},
				});
			},
		}),
	],
})
export class BackofficeModule { }
