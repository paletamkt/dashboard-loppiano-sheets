import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DailySalesMetrics } from '../types';

interface DailySalesChartProps {
  data: DailySalesMetrics[];
  isLoading: boolean;
}

export function DailySalesChart({ data, isLoading }: DailySalesChartProps) {
  if (isLoading) {
    return <div className="text-center py-8">Carregando dados...</div>;
  }

  if (!data.length) {
    return <div className="text-center py-8 text-gray-500">Nenhum dado disponível</div>;
  }

  const chartData = data
    .reverse()
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      realizado: item.actual_revenue,
      meta: item.target_revenue,
      channel: item.channel,
    }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => `R$ ${(value as number).toFixed(2)}`} />
          <Legend />
          <Bar dataKey="realizado" fill="#8884d8" name="Realizado" />
          <Bar dataKey="meta" fill="#82ca9d" name="Meta" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
