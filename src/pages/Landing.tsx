import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Users, 
  ClipboardList, 
  DollarSign, 
  Calculator,
  ArrowRight,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">MarmoTech</h1>
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Acessar Sistema <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Sistema Completo para Gestão de Marmorarias
            </h2>
            <p className="text-xl mb-8">
              Controle total do seu negócio em uma única plataforma
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
            >
              Começar Agora
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-center mb-12">
            Funcionalidades Principais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Package className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="text-lg font-semibold mb-2">Controle de Estoque</h4>
              <p className="text-gray-600">
                Gerencie seu estoque de materiais com precisão e evite perdas
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Users className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="text-lg font-semibold mb-2">Gestão de Clientes</h4>
              <p className="text-gray-600">
                Cadastro completo e histórico de relacionamento com clientes
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <ClipboardList className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="text-lg font-semibold mb-2">Pedidos e Orçamentos</h4>
              <p className="text-gray-600">
                Controle de pedidos e geração de orçamentos profissionais
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Calculator className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="text-lg font-semibold mb-2">Cálculos Automáticos</h4>
              <p className="text-gray-600">
                Cálculos precisos de materiais e custos para seus projetos
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DollarSign className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="text-lg font-semibold mb-2">Controle Financeiro</h4>
              <p className="text-gray-600">
                Gestão completa de entradas, saídas e relatórios financeiros
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-center mb-12">Entre em Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Phone className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Telefone</h4>
                <p className="text-gray-600">(11) 99999-9999</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Mail className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Email</h4>
                <p className="text-gray-600">contato@marmotech.com.br</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Endereço</h4>
                <p className="text-gray-600">Rua das Pedras, 123 - São Paulo/SP</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>© 2024 MarmoTech. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}