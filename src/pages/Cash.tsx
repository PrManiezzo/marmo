import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  FileText, 
  TrendingUp,
  Calendar,
  Download
} from 'lucide-react';
import Table from '../components/Table';
import Button from '../components/Button';
import SearchInput from '../components/SearchInput';
import { useCashStore } from '../store/cashStore';
import { formatCurrency } from '../utils/format';
import CashTransactionModal from '../components/cash/CashTransactionModal';
import CashReportModal from '../components/cash/CashReportModal';

export default function Cash() {
  const { transactions, balance, generateReport } = useCashStore();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.description.toLowerCase().includes(searchLower) ||
      transaction.category.toLowerCase().includes(searchLower) ||
      transaction.amount.toString().includes(searchLower) ||
      transaction.paymentMethod.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      header: 'Data',
      accessor: (transaction) => new Date(transaction.date).toLocaleDateString('pt-BR')
    },
    {
      header: 'Tipo',
      accessor: (transaction) => (
        <span className={`px-2 py-1 rounded-full text-sm ${
          transaction.type === 'income' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {transaction.type === 'income' ? 'Entrada' : 'Saída'}
        </span>
      )
    },
    { header: 'Categoria', accessor: 'category' },
    {
      header: 'Valor',
      accessor: (transaction) => (
        <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
          {formatCurrency(transaction.amount)}
        </span>
      )
    },
    { header: 'Descrição', accessor: 'description' },
    {
      header: 'Forma de Pagamento',
      accessor: (transaction) => {
        const methods = {
          cash: 'Dinheiro',
          credit_card: 'Cartão de Crédito',
          debit_card: 'Cartão de Débito',
          bank_transfer: 'Transferência',
          pix: 'PIX'
        };
        return methods[transaction.paymentMethod];
      }
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Controle de Caixa</h1>
          <p className="text-gray-600">Gerencie entradas e saídas financeiras</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            icon={Calendar}
            onClick={() => setIsReportModalOpen(true)}
          >
            Relatório
          </Button>
          <Button
            icon={Plus}
            onClick={() => setIsTransactionModalOpen(true)}
          >
            Nova Transação
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Saldo Atual</p>
              <p className={`text-2xl font-bold ${
                balance.total >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(balance.total)}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Entradas (Mês)</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  transactions
                    .filter(t => 
                      t.type === 'income' && 
                      new Date(t.date).getMonth() === new Date().getMonth()
                    )
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Saídas (Mês)</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(
                  transactions
                    .filter(t => 
                      t.type === 'expense' && 
                      new Date(t.date).getMonth() === new Date().getMonth()
                    )
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar por descrição, categoria, valor ou forma de pagamento..."
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table columns={columns} data={filteredTransactions} />
      </div>

      <CashTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />

      <CashReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onGenerate={generateReport}
      />
    </div>
  );
}