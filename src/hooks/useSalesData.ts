import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { DailySalesMetrics, HourlySalesMetrics, ProductSales, AttendantMetrics } from '../types';

interface UseSalesDataOptions {
  startDate?: string;
  endDate?: string;
}

export function useDailySales(options?: UseSalesDataOptions) {
  const [data, setData] = useState<DailySalesMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDailySales();
  }, [options?.startDate, options?.endDate]);

  async function fetchDailySales() {
    try {
      setIsLoading(true);
      let query = supabase
        .from('daily_sales_metrics')
        .select('*')
        .order('date', { ascending: false });

      if (options?.startDate) {
        query = query.gte('date', options.startDate);
      }
      if (options?.endDate) {
        query = query.lte('date', options.endDate);
      }

      const { data: result, error: err } = await query;

      if (err) throw err;
      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch daily sales'));
    } finally {
      setIsLoading(false);
    }
  }

  return { data, isLoading, error, refetch: fetchDailySales };
}

export function useHourlySales(options?: UseSalesDataOptions) {
  const [data, setData] = useState<HourlySalesMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchHourlySales();
  }, [options?.startDate, options?.endDate]);

  async function fetchHourlySales() {
    try {
      setIsLoading(true);
      let query = supabase
        .from('hourly_sales_metrics')
        .select('*')
        .order('date', { ascending: false })
        .order('hour', { ascending: true });

      if (options?.startDate) {
        query = query.gte('date', options.startDate);
      }
      if (options?.endDate) {
        query = query.lte('date', options.endDate);
      }

      const { data: result, error: err } = await query;

      if (err) throw err;
      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch hourly sales'));
    } finally {
      setIsLoading(false);
    }
  }

  return { data, isLoading, error, refetch: fetchHourlySales };
}

export function useProductSales(options?: UseSalesDataOptions) {
  const [data, setData] = useState<ProductSales[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchProductSales();
  }, [options?.startDate, options?.endDate]);

  async function fetchProductSales() {
    try {
      setIsLoading(true);
      let query = supabase
        .from('product_sales')
        .select('*')
        .order('date', { ascending: false });

      if (options?.startDate) {
        query = query.gte('date', options.startDate);
      }
      if (options?.endDate) {
        query = query.lte('date', options.endDate);
      }

      const { data: result, error: err } = await query;

      if (err) throw err;
      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch product sales'));
    } finally {
      setIsLoading(false);
    }
  }

  return { data, isLoading, error, refetch: fetchProductSales };
}

export function useAttendantMetrics(options?: UseSalesDataOptions) {
  const [data, setData] = useState<AttendantMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAttendantMetrics();
  }, [options?.startDate, options?.endDate]);

  async function fetchAttendantMetrics() {
    try {
      setIsLoading(true);
      let query = supabase
        .from('attendant_metrics')
        .select('*')
        .order('date', { ascending: false });

      if (options?.startDate) {
        query = query.gte('date', options.startDate);
      }
      if (options?.endDate) {
        query = query.lte('date', options.endDate);
      }

      const { data: result, error: err } = await query;

      if (err) throw err;
      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch attendant metrics'));
    } finally {
      setIsLoading(false);
    }
  }

  return { data, isLoading, error, refetch: fetchAttendantMetrics };
}
