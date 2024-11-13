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
  Mail,
  Phone,
  MessageSquare,
  CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Gestão de Clientes',
    description: 'Cadastre e gerencie seus clientes de forma eficiente e organizada'
  },
  {
    icon: Package,
    title: 'Controle de Produtos',
    description: 'Gerencie seu catálogo de produtos e materiais com facilidade'
  },
  {
    icon: ClipboardList,
    title: 'Pedidos',
    description: 'Acompanhe e gerencie todos os pedidos em um só lugar'
  },
  {
    icon: Warehouse,
    title: 'Controle de Estoque',
    description: 'Mantenha seu estoque atualizado e organizado automaticamente'
  },
  {
    icon: Calculator,
    title: 'Orçamentos',
    description: 'Crie orçamentos profissionais de forma rápida e precisa'
  },
  {
    icon: Wrench,
    title: 'Serviços',
    description: 'Gerencie todos os serviços oferecidos pela sua marmoraria'
  },
  {
    icon: DollarSign,
    title: 'Controle Financeiro',
    description: 'Acompanhe entradas, saídas e relatórios financeiros'
  },
  {
    icon: TrendingUp,
    title: 'Relatórios',
    description: 'Visualize relatórios detalhados e tome decisões baseadas em dados'
  }
];

const benefits = [
  {
    icon: CheckCircle,
    title: 'Aumente a Produtividade',
    description: 'Automatize processos e reduza o tempo gasto com tarefas administrativas'
  },
  {
    icon: CheckCircle,
    title: 'Reduza Erros',
    description: 'Sistema integrado que minimiza erros de cálculo e comunicação'
  },
  {
    icon: CheckCircle,
    title: 'Melhore o Atendimento',
    description: 'Acesso rápido a informações para atender seus clientes com excelência'
  },
  {
    icon: CheckCircle,
    title: 'Controle Total',
    description: 'Tenha controle completo sobre todas as operações do seu negócio'
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              MarmoTech: Sistema Completo para Gestão de Marmorarias
            </h1>
            <p className="text-xl mb-8">
              Automatize seus processos, aumente sua produtividade e tenha controle total do seu negócio
            </p>
            <div className="space-x-4">
              <Link
                to="/login"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Acessar Sistema
              </Link>
              <a
                href="#contact"
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-400 transition-colors"
              >
                Solicitar Demonstração
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Funcionalidades Completas para sua Marmoraria
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-100 py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Benefícios para seu Negócio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Icon className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Entre em Contato</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <a
                href="mailto:contato@marmotech.com.br"
                className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <Mail className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-600">contato@marmotech.com.br</p>
              </a>
              <a
                href="tel:+551199999999"
                className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <Phone className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">Telefone</h3>
                <p className="text-gray-600">(11) 9999-9999</p>
              </a>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <MessageSquare className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">WhatsApp</h3>
                <p className="text-gray-600">(11) 99999-9999</p>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">MarmoTech</h2>
            <p className="text-gray-400">
              Sistema completo para gestão de marmorarias
            </p>
            <div className="mt-8">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} MarmoTech. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}