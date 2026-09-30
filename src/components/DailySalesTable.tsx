import type { DailySalesMetrics } from '../types';

interface DailySalesTableProps {
  data: DailySalesMetrics[];
  isLoading: boolean;
}

export function DailySalesTable({ data, isLoading }: DailySalesTableProps) {
  if (isLoading) {
    return <div className="text-center py-8">Carregando dados...</div>;
  }

  if (!data.length) {
    return <div className="text-center py-8 text-gray-500">Nenhum dado disponível</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Canal</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Meta</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Realizado</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">% Atingido</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Pedidos</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Ticket Médio</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => {
              const percentage = item.target_revenue > 0
                ? ((item.actual_revenue / item.target_revenue) * 100).toFixed(1)
                : '0.0';
              const channelLabel = item.channel === 'salao' ? 'Salão' : 'Delivery';

              return (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-3 text-sm text-gray-900">
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`inline-block px-2 py-1 rounded text-white text-xs font-medium ${
                      item.channel === 'salao' ? 'bg-blue-500' : 'bg-amber-500'
                    }`}>
                      {channelLabel}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-gray-900">
                    R$ {item.target_revenue.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-3 text-sm text-right font-semibold text-gray-900">
                    R$ {item.actual_revenue.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                  </td>
                  <td className={`px-6 py-3 text-sm text-right font-medium ${
                    parseFloat(percentage) >= 100 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {percentage}%
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-gray-900">
                    {item.order_count}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-gray-900">
                    R$ {item.average_ticket?.toFixed(2) || 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
