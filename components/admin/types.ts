import { Order } from '@/lib/types';

export type AdminTab = 'orders' | 'generator';
export type OrderFilter = 'all' | 'paid' | 'pending' | 'cancelled';

export interface AdminStats {
  total: number;
  pending: number;
  paid: number;
  active: number;
  revenue: number;
}

export interface GenResult {
  serialKey: string;
  waTemplate: string;
  order?: Order;
}
