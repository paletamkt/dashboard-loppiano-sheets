export type SalesChannel = 'salao' | 'delivery';

export interface DailySalesMetrics {
  id: string;
  date: string;
  channel: SalesChannel;
  actual_revenue: number;
  target_revenue: number;
  order_count: number;
  average_ticket: number;
  created_at: string;
  updated_at: string;
}

export interface HourlySalesMetrics {
  id: string;
  date: string;
  hour: number;
  channel: SalesChannel;
  revenue: number;
  order_count: number;
  created_at: string;
}

export interface ProductSales {
  id: string;
  date: string;
  product_group: string;
  product_name: string;
  quantity: number;
  revenue: number;
  created_at: string;
}

export interface AttendantMetrics {
  id: string;
  date: string;
  attendant_name: string;
  total_sales: number;
  order_count: number;
  average_ticket: number;
  created_at: string;
}

export interface DashboardData {
  dailySales: DailySalesMetrics[];
  hourlySales: HourlySalesMetrics[];
  productSales: ProductSales[];
  attendantMetrics: AttendantMetrics[];
  summary: {
    totalRevenue: number;
    targetRevenue: number;
    achievedPercentage: number;
    totalOrders: number;
    averageTicket: number;
  };
}
