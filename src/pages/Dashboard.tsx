import React from 'react';
import { 
  DollarSign, 
  Package, 
  Users, 
  ClipboardList,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { useStore } from '../store';
import { formatCurrency } from '../utils/format';

export default function Dashboard() {
  const { orders, customers, products } = useStore();

  // Calculate total revenue from completed orders in the last 30 days
  const recentOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return orderDate >= thirtyDaysAgo;
  });

  const totalRevenue = recentOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const previousRevenue = orders
    .filter(order => {
      const orderDate = new Date(order.createdAt);
      const sixtyDaysAgo = new Date();
      const thirtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
    })
    .reduce((sum, order) => sum + order.totalPrice, 0);

  const revenueTrend = previousRevenue ? 
    ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  // Get active orders (pending or in progress)
  const activeOrders = orders.filter(order => 
    order.status === 'pending' || order.status === 'in_progress'
  );

  // Calculate low stock items
  const lowStockItems = products.filter(product => 
    product.stock.quantity <= product.stock.minQuantity
  );

  // Get recent customers (last 30 days)
  const recentCustomers = customers.filter(customer => {
    const customerDate = new Date(customer.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return customerDate >= thirtyDaysAgo;
  });

  // Get recent orders for display
  const latestOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo! Aqui está o resumo do dia.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Receita (30 dias)"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          trend={revenueTrend ? { value: Math.round(revenueTrend * 10) / 10, isPositive: revenueTrend > 0 } : undefined}
        />
        <DashboardCard
          title="Pedidos Ativos"
          value={activeOrders.length}
          icon={ClipboardList}
        />
        <DashboardCard
          title="Novos Clientes (30 dias)"
          value={recentCustomers.length}
          icon={Users}
        />
        <DashboardCard
          title="Itens Baixo Estoque"
          value={lowStockItems.length}
          icon={Package}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Pedidos Recentes</h2>
            <button className="text-blue-600 hover:text-blue-800">Ver todos</button>
          </div>
          <div className="space-y-4">
            {latestOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-gray-600">Pedido #{order.id}</p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  {
                    pending: 'bg-yellow-100 text-yellow-800',
                    in_progress: 'bg-blue-100 text-blue-800',
                    completed: 'bg-green-100 text-green-800',
                    cancelled: 'bg-red-100 text-red-800'
                  }[order.status]
                }`}>
                  {
                    {
                      pending: 'Pendente',
                      in_progress: 'Em Andamento',
                      completed: 'Concluído',
                      cancelled: 'Cancelado'
                    }[order.status]
                  }
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Alertas</h2>
          </div>
          <div className="space-y-4">
            {lowStockItems.map(product => (
              <div key={product.id} className="flex items-start gap-3 p-4 bg-red-50 text-red-800 rounded-lg">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="font-medium">Alerta de estoque baixo</p>
                  <p className="text-sm">
                    {product.name} está com estoque baixo 
                    ({product.stock.quantity} {product.stock.unit} restantes)
                  </p>
                </div>
              </div>
            ))}
            {orders.filter(order => order.status === 'pending').length > 0 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="font-medium">Pedidos pendentes</p>
                  <p className="text-sm">
                    {orders.filter(order => order.status === 'pending').length} pedidos aguardando processamento
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}