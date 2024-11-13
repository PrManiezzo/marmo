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
  DollarSign,
  LogOut,
  Home
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const menuItems = [
  { icon: Home, label: 'Home', path: '/app/home' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
  { icon: Users, label: 'Clientes', path: '/app/clientes' },
  { icon: Package, label: 'Produtos', path: '/app/produtos' },
  { icon: ClipboardList, label: 'Pedidos', path: '/app/pedidos' },
  { icon: Warehouse, label: 'Estoque', path: '/app/estoque' },
  { icon: Calculator, label: 'Orçamentos', path: '/app/orcamentos' },
  { icon: Wrench, label: 'Serviços', path: '/app/servicos' },
  { icon: DollarSign, label: 'Caixa', path: '/app/caixa' },
  { icon: TrendingUp, label: 'Relatórios', path: '/app/relatorios' },
  { icon: Settings, label: 'Configurações', path: '/app/configuracoes' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center">MarmoTech</h1>
      </div>
      <nav className="flex-1">
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
      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-gray-800 transition-colors mt-4"
      >
        <LogOut size={20} />
        <span>Sair</span>
      </button>
    </div>
  );
}