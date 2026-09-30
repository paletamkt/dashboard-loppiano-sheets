import { useState, useMemo } from 'react';
import { useDailySales } from './hooks/useSalesData';
import { SummaryCard } from './components/SummaryCard';
import { DailySalesChart } from './components/DailySalesChart';
import { ChannelComparison } from './components/ChannelComparison';
import './App.css';

function App() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data: dailySales, isLoading: dailyLoading } = useDailySales({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });


  const summary = useMemo(() => {
    const totalRevenue = dailySales.reduce((sum, item) => sum + item.actual_revenue, 0);
    const targetRevenue = dailySales.reduce((sum, item) => sum + item.target_revenue, 0);
    const totalOrders = dailySales.reduce((sum, item) => sum + item.order_count, 0);
    const achievedPercentage = targetRevenue > 0 ? (totalRevenue / targetRevenue) * 100 : 0;
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      targetRevenue,
      achievedPercentage,
      totalOrders,
      averageTicket,
    };
  }, [dailySales]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Loppiano</h1>
          <p className="text-gray-600 mt-2">Análise de Faturamento e Vendas</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Date Range Selector */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Faturamento Total"
            value={summary.totalRevenue}
            icon="revenue"
            isLoading={dailyLoading}
          />
          <SummaryCard
            title="Meta"
            value={summary.targetRevenue}
            icon="target"
            isLoading={dailyLoading}
          />
          <SummaryCard
            title="Total de Pedidos"
            value={summary.totalOrders}
            icon="orders"
            isLoading={dailyLoading}
          />
          <SummaryCard
            title="Ticket Médio"
            value={summary.averageTicket}
            icon="ticket"
            isLoading={dailyLoading}
          />
        </div>

        {/* Achievement Percentage */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Meta Atingida</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div
                  className={`h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all ${
                    summary.achievedPercentage >= 100 ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(summary.achievedPercentage, 100)}%` }}
                >
                  {summary.achievedPercentage.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Faturamento Diário</h3>
            <DailySalesChart data={dailySales} isLoading={dailyLoading} />
          </div>

          <ChannelComparison data={dailySales} isLoading={dailyLoading} />
        </div>

        {/* Loading indicator */}
        {dailyLoading && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Atualizando dados em tempo real...
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
