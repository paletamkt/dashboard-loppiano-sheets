import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { DailySalesMetrics } from '../types';

interface ChannelComparisonProps {
  data: DailySalesMetrics[];
  isLoading: boolean;
}

const COLORS = {
  salao: '#3b82f6',
  delivery: '#f59e0b',
};

export function ChannelComparison({ data, isLoading }: ChannelComparisonProps) {
  if (isLoading) {
    return <div className="text-center py-8">Carregando dados...</div>;
  }

  const channelSummary = data.reduce(
    (acc, item) => {
      const channel = item.channel === 'salao' ? 'Salão' : 'Delivery';
      const existing = acc.find((x) => x.name === channel);
      if (existing) {
        existing.value += item.actual_revenue;
      } else {
        acc.push({ name: channel, value: item.actual_revenue });
      }
      return acc;
    },
    [] as Array<{ name: string; value: number }>
  );

  if (!channelSummary.length) {
    return <div className="text-center py-8 text-gray-500">Nenhum dado disponível</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Faturamento por Canal</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={channelSummary}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: R$ ${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {channelSummary.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name.toLowerCase() as 'salao' | 'delivery']} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `R$ ${(value as number).toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
