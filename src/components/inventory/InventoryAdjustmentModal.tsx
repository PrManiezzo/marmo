import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Package } from 'lucide-react';
import Modal from '../Modal';
import Select from '../Select';
import Input from '../Input';
import TextArea from '../TextArea';
import Button from '../Button';
import { useStore } from '../../store';

type AdjustmentType = 'entrada' | 'saida' | 'correcao';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

export default function InventoryAdjustmentModal({ isOpen, onClose, productId }: Props) {
  const { products, updateProductStock, addStockMovement } = useStore();
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>('entrada');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!quantity || !reason) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError('Quantidade deve ser maior que zero');
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    let newQuantity = product.stock.quantity;
    switch (adjustmentType) {
      case 'entrada':
        newQuantity += quantityNum;
        break;
      case 'saida':
        if (quantityNum > product.stock.quantity) {
          setError('Quantidade insuficiente em estoque');
          return;
        }
        newQuantity -= quantityNum;
        break;
      case 'correcao':
        if (quantityNum < 0) {
          setError('A quantidade corrigida não pode ser negativa');
          return;
        }
        newQuantity = quantityNum;
        break;
    }

    updateProductStock(productId, newQuantity);
    addStockMovement({
      id: Date.now().toString(),
      productId,
      type: adjustmentType,
      quantity: adjustmentType === 'saida' ? -quantityNum : quantityNum,
      reason,
      date: new Date().toISOString()
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setAdjustmentType('entrada');
    setQuantity('');
    setReason('');
    setError('');
  };

  const getAdjustmentIcon = () => {
    switch (adjustmentType) {
      case 'entrada':
        return ArrowUp;
      case 'saida':
        return ArrowDown;
      default:
        return Package;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        resetForm();
      }}
      title="Ajuste de Estoque"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Tipo de Ajuste"
          value={adjustmentType}
          onChange={(e) => setAdjustmentType(e.target.value as AdjustmentType)}
          options={[
            { value: 'entrada', label: 'Entrada' },
            { value: 'saida', label: 'Saída' },
            { value: 'correcao', label: 'Correção' }
          ]}
          required
        />

        <Input
          label="Quantidade"
          type="number"
          step="0.01"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Informe a quantidade em unidades. Números decimais são permitidos."
          error={error}
          required
        />

        <TextArea
          label="Motivo"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          required
        />

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

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
          <Button type="submit" icon={getAdjustmentIcon()}>
            Confirmar Ajuste
          </Button>
        </div>
      </form>
    </Modal>
  );
}
