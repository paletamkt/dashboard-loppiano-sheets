import { TrendingUp, Target, ShoppingCart, DollarSign } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: 'revenue' | 'target' | 'orders' | 'ticket';
  trend?: number;
  isLoading?: boolean;
}

const iconMap = {
  revenue: DollarSign,
  target: Target,
  orders: ShoppingCart,
  ticket: TrendingUp,
};

export function SummaryCard({ title, value, icon, trend, isLoading }: SummaryCardProps) {
  const Icon = iconMap[icon];

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (icon === 'orders') return Math.floor(val).toLocaleString('pt-BR');
      if (icon === 'ticket') return `R$ ${val.toFixed(2)}`;
      return `R$ ${val.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`;
    }
    return val;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-3/4" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatValue(value)}</p>
          {trend !== undefined && (
            <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
            </p>
          )}
        </div>
        <Icon className="text-blue-500" size={32} />
      </div>
    </div>
  );
}
