import { NotificationMethod } from './notification.model';

export type TransactionType = 'subscription' | 'cancellation';

export interface Transaction {
  id: number;
  fundId: number;
  fundName: string;
  type: TransactionType;
  amount: number;
  notificationMethod: NotificationMethod | null;
  timestamp: string;
}
