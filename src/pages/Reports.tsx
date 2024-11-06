import React, { useState } from 'react';
import { FileText, Download, TrendingUp } from 'lucide-react';
import Button from '../components/Button';
import DashboardCard from '../components/DashboardCard';
import { useStore } from '../store';
import { formatCurrency } from '../utils/format';

export default function Reports() {
  const { orders, products } = useStore();
  const [dateRange, setDateRange] = useState('month');

  // Filter orders based on date range
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    switch (dateRange) {
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return orderDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return orderDate >= monthAgo;
      case 'quarter':
        const quarterAgo = new Date(now.setMonth(now.getMonth() - 3));
        return orderDate >= quarterAgo;
      case 'year':
        const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
        return orderDate >= yearAgo;
      default:
        return true;
    }
  });

  // Calculate metrics
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const completedOrders = filteredOrders.filter(order => order.status === 'completed');
  const averageTicket = completedOrders.length > 0 
    ? totalRevenue / completedOrders.length 
    : 0;

  // Calculate product sales
  const productSales = products.map(product => {
    const sales = filteredOrders.reduce((total, order) => {
      const orderItem = order.items.find(item => item.productId === product.id);
      return total + (orderItem ? orderItem.quantity : 0);
    }, 0);
    return { name: product.name, value: sales };
  }).sort((a, b) => b.value - a.value).slice(0, 5);

  // Calculate regional performance
  const regionalSales = filteredOrders.reduce((acc, order) => {
    const region = order.customerName.split(' ')[0]; // Simplified for example
    acc[region] = (acc[region] || 0) + order.totalPrice;
    return acc;
  }, {} as Record<string, number>);

  const totalRegionalSales = Object.values(regionalSales).reduce((sum, value) => sum + value, 0);
  const regionalPerformance = Object.entries(regionalSales)
    .map(([region, value]) => ({
      region,
      value: (value / totalRegionalSales) * 100
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <p className="text-gray-600">Análise de dados e relatórios gerenciais</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="quarter">Último Trimestre</option>
            <option value="year">Último Ano</option>
          </select>
          <Button icon={Download}>
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Faturamento"
          value={formatCurrency(totalRevenue)}
          icon={TrendingUp}
        />
        <DashboardCard
          title="Pedidos Finalizados"
          value={completedOrders.length}
          icon={FileText}
        />
        <DashboardCard
          title="Ticket Médio"
          value={formatCurrency(averageTicket)}
          icon={TrendingUp}
        />
        <DashboardCard
          title="Taxa de Conversão"
          value={`${((completedOrders.length / filteredOrders.length) * 100).toFixed(1)}%`}
          icon={FileText}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Produtos Mais Vendidos</h2>
          <div className="space-y-4">
            {productSales.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${(item.value / productSales[0].value) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="ml-4 text-sm text-gray-600">{item.value} unid.</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Desempenho por Região</h2>
          <div className="space-y-4">
            {regionalPerformance.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{item.region}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
                <span className="ml-4 text-sm text-gray-600">{item.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}