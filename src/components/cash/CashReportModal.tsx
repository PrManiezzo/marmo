import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import { CashReport } from '../../types/cash';
import { formatCurrency } from '../../utils/format';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (startDate: string, endDate: string) => CashReport;
}

export default function CashReportModal({ isOpen, onClose, onGenerate }: Props) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState<CashReport | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = () => {
    setError('');

    if (!startDate || !endDate) {
      setError('Selecione as datas inicial e final');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('A data inicial deve ser anterior à data final');
      return;
    }

    const report = onGenerate(startDate, endDate);
    setReport(report);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setStartDate('');
        setEndDate('');
        setReport(null);
        setError('');
      }}
      title="Relatório Financeiro"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Data Inicial"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="Data Final"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <Button
          type="button"
          icon={FileText}
          onClick={handleGenerate}
          className="w-full"
        >
          Gerar Relatório
        </Button>

        {report && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Saldo Inicial</p>
                <p className="text-lg font-medium">
                  {formatCurrency(report.initialBalance)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Saldo Final</p>
                <p className="text-lg font-medium">
                  {formatCurrency(report.finalBalance)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Total Entradas</p>
                <p className="text-lg font-medium text-green-600">
                  {formatCurrency(report.totalIncome)}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">Total Saídas</p>
                <p className="text-lg font-medium text-red-600">
                  {formatCurrency(report.totalExpense)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Por Categoria</h3>
              <div className="space-y-2">
                {Object.entries(report.byCategory).map(([category, values]) => (
                  <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{category}</span>
                    <div className="space-x-4">
                      <span className="text-green-600">
                        {formatCurrency(values.income)}
                      </span>
                      <span className="text-red-600">
                        {formatCurrency(values.expense)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Por Forma de Pagamento</h3>
              <div className="space-y-2">
                {Object.entries(report.byPaymentMethod).map(([method, values]) => (
                  <div key={method} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">
                      {
                        {
                          cash: 'Dinheiro',
                          credit_card: 'Cartão de Crédito',
                          debit_card: 'Cartão de Débito',
                          bank_transfer: 'Transferência',
                          pix: 'PIX'
                        }[method]
                      }
                    </span>
                    <div className="space-x-4">
                      <span className="text-green-600">
                        {formatCurrency(values.income)}
                      </span>
                      <span className="text-red-600">
                        {formatCurrency(values.expense)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}