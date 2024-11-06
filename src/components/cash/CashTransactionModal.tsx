import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import Modal from '../Modal';
import Input from '../Input';
import Select from '../Select';
import TextArea from '../TextArea';
import Button from '../Button';
import { useCashStore } from '../../store/cashStore';
import { CashTransaction } from '../../types/cash';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction?: CashTransaction;
}

export default function CashTransactionModal({ isOpen, onClose, transaction }: Props) {
  const { addTransaction, updateTransaction } = useCashStore();
  const [formData, setFormData] = useState<Partial<CashTransaction>>(
    transaction || {
      type: 'income',
      paymentMethod: 'cash',
      date: new Date().toISOString().split('T')[0]
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = {
    income: [
      'Vendas',
      'Serviços',
      'Pagamentos',
      'Outros'
    ],
    expense: [
      'Fornecedores',
      'Funcionários',
      'Materiais',
      'Equipamentos',
      'Aluguel',
      'Utilities',
      'Marketing',
      'Impostos',
      'Outros'
    ]
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.amount || formData.amount <= 0) {
      errors.amount = 'Valor deve ser maior que zero';
    }

    if (!formData.category?.trim()) {
      errors.category = 'Categoria é obrigatória';
    }

    if (!formData.description?.trim()) {
      errors.description = 'Descrição é obrigatória';
    }

    if (!formData.date) {
      errors.date = 'Data é obrigatória';
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const transactionData: CashTransaction = {
      id: transaction?.id || `trans-${Date.now()}`,
      ...formData as CashTransaction,
      createdAt: transaction?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (transaction) {
      updateTransaction(transaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }

    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'income',
      paymentMethod: 'cash',
      date: new Date().toISOString().split('T')[0]
    });
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        resetForm();
      }}
      title={transaction ? 'Editar Transação' : 'Nova Transação'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Tipo"
            value={formData.type || 'income'}
            onChange={(e) => setFormData({ 
              ...formData, 
              type: e.target.value as 'income' | 'expense',
              category: '' // Reset category when type changes
            })}
            options={[
              { value: 'income', label: 'Entrada' },
              { value: 'expense', label: 'Saída' }
            ]}
            required
          />

          <Select
            label="Categoria"
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={categories[formData.type || 'income'].map(cat => ({
              value: cat,
              label: cat
            }))}
            error={errors.category}
            required
          />
        </div>

        <Input
          label="Valor"
          type="number"
          step="0.01"
          value={formData.amount || ''}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          error={errors.amount}
          required
        />

        <Select
          label="Forma de Pagamento"
          value={formData.paymentMethod || 'cash'}
          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
          options={[
            { value: 'cash', label: 'Dinheiro' },
            { value: 'credit_card', label: 'Cartão de Crédito' },
            { value: 'debit_card', label: 'Cartão de Débito' },
            { value: 'bank_transfer', label: 'Transferência' },
            { value: 'pix', label: 'PIX' }
          ]}
          required
        />

        <Input
          label="Data"
          type="date"
          value={formData.date?.split('T')[0] || ''}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          error={errors.date}
          required
        />

        <TextArea
          label="Descrição"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          error={errors.description}
          required
          rows={3}
        />

        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={() => {
              onClose();
              resetForm();
            }}
          >
            Cancelar
          </Button>
          <Button type="submit" icon={DollarSign}>
            {transaction ? 'Atualizar' : 'Registrar'} Transação
          </Button>
        </div>
      </form>
    </Modal>
  );
}