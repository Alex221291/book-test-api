import { PubSub } from 'graphql-subscriptions';
import { NotificationsEntity } from './notifications.entity';
import { UserEntity } from '../users/users.entity';
import { NotificationsService } from './notifications.service';
export declare class NotificationsResolver {
    private readonly pubSub;
    private readonly notificationsService;
    constructor(pubSub: PubSub, notificationsService: NotificationsService);
    notificationAdded(company: string): AsyncIterator<unknown, any, undefined>;
    getNotifications(user: UserEntity, company: string): Promise<NotificationsEntity[]>;
    readNotification(user: UserEntity, id: number): Promise<NotificationsEntity>;
}
