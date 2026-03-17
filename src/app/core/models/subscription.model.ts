import { NotificationMethod } from './notification.model';

export interface Subscription {
  id: number;
  fundId: number;
  fundName: string;
  amount: number;
  notificationMethod: NotificationMethod;
  subscribedAt: string;
}
