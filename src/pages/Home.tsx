import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Package,
  ClipboardList,
  Warehouse,
  Calculator,
  Wrench,
  DollarSign,
  TrendingUp,
  Settings
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Gestão de Clientes',
    description: 'Cadastre e gerencie seus clientes de forma eficiente',
    path: '/clientes',
    color: 'bg-blue-500'
  },
  {
    icon: Package,
    title: 'Controle de Produtos',
    description: 'Gerencie seu catálogo de produtos e materiais',
    path: '/produtos',
    color: 'bg-green-500'
  },
  {
    icon: ClipboardList,
    title: 'Pedidos',
    description: 'Acompanhe e gerencie todos os pedidos',
    path: '/pedidos',
    color: 'bg-purple-500'
  },
  {
    icon: Warehouse,
    title: 'Controle de Estoque',
    description: 'Mantenha seu estoque atualizado e organizado',
    path: '/estoque',
    color: 'bg-yellow-500'
  },
  {
    icon: Calculator,
    title: 'Orçamentos',
    description: 'Crie e gerencie orçamentos para seus clientes',
    path: '/orcamentos',
    color: 'bg-pink-500'
  },
  {
    icon: Wrench,
    title: 'Serviços',
    description: 'Gerencie os serviços oferecidos',
    path: '/servicos',
    color: 'bg-indigo-500'
  },
  {
    icon: DollarSign,
    title: 'Controle Financeiro',
    description: 'Acompanhe entradas e saídas financeiras',
    path: '/caixa',
    color: 'bg-red-500'
  },
  {
    icon: TrendingUp,
    title: 'Relatórios',
    description: 'Visualize relatórios e análises detalhadas',
    path: '/relatorios',
    color: 'bg-cyan-500'
  },
  {
    icon: Settings,
    title: 'Configurações',
    description: 'Personalize as configurações do sistema',
    path: '/configuracoes',
    color: 'bg-gray-500'
  }
];

export default function Home() {
  return (
    <div className="p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao MarmoTech
        </h1>
        <p className="text-xl text-gray-600">
          Sistema completo para gestão de marmorarias
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Link
              key={index}
              to={feature.path}
              className="block group"
            >
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className={`${feature.color} text-white p-3 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Principais Benefícios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Organização
            </h3>
            <p className="text-gray-600">
              Mantenha todos os processos organizados e documentados
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Eficiência
            </h3>
            <p className="text-gray-600">
              Otimize o tempo com processos automatizados
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Controle
            </h3>
            <p className="text-gray-600">
              Tenha total controle sobre suas operações
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}