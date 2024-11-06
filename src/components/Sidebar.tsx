import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ClipboardList, 
  Settings,
  Warehouse,
  Calculator,
  TrendingUp,
  Wrench,
  DollarSign
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Clientes', path: '/clientes' },
  { icon: Package, label: 'Produtos', path: '/produtos' },
  { icon: ClipboardList, label: 'Pedidos', path: '/pedidos' },
  { icon: Warehouse, label: 'Estoque', path: '/estoque' },
  { icon: Calculator, label: 'Orçamentos', path: '/orcamentos' },
  { icon: Wrench, label: 'Serviços', path: '/servicos' },
  { icon: DollarSign, label: 'Caixa', path: '/caixa' },
  { icon: TrendingUp, label: 'Relatórios', path: '/relatorios' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center">MarmoTech</h1>
      </div>
      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}