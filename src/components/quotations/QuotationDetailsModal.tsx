import React from 'react';
import { Package, Check, X, Printer } from 'lucide-react';
import Modal from '../Modal';
import Button from '../Button';
import { useStore } from '../../store';
import { Quotation } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  quotation: Quotation | null;
  onPrint: (quotation: Quotation) => void;
}

export default function QuotationDetailsModal({ isOpen, onClose, quotation, onPrint }: Props) {
  const { updateQuotation, addProductPieces, updateProductStock, addStockMovement } = useStore();

  if (!quotation) return null;

  const handleStatusChange = (newStatus: 'approved' | 'rejected') => {
    if (!quotation) return;

    updateQuotation(quotation.id, {
      ...quotation,
      status: newStatus,
      statusUpdatedAt: new Date().toISOString()
    });
  };

  const handleGenerateStock = () => {
    if (!quotation) return;

    // Para cada item do orçamento, gerar entrada no estoque
    quotation.items.forEach(item => {
      // Adicionar movimento no estoque
      addStockMovement({
        id: Date.now().toString(),
        productId: item.productId,
        type: 'entrada',
        quantity: item.quantity,
        reason: `Entrada gerada do orçamento #${quotation.id}`,
        date: new Date().toISOString()
      });

      // Se o item tem medidas específicas, adicionar como peças
      if (item.measurements) {
        addProductPieces(item.productId, [{
          id: Date.now().toString(),
          width: item.measurements.width,
          length: item.measurements.length,
          thickness: item.measurements.thickness
        }]);
      } else {
        // Caso contrário, apenas atualizar a quantidade
        updateProductStock(item.productId, item.quantity);
      }
    });

    // Atualizar o orçamento para indicar que o estoque foi gerado
    updateQuotation(quotation.id, {
      ...quotation,
      stockGenerated: true,
      stockGeneratedAt: new Date().toISOString()
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Orçamento #${quotation.id}`}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Cliente</p>
            <p className="font-medium">{quotation.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className={`font-medium ${
              {
                pending: 'text-yellow-600',
                approved: 'text-green-600',
                rejected: 'text-red-600'
              }[quotation.status]
            }`}>
              {
                {
                  pending: 'Pendente',
                  approved: 'Aprovado',
                  rejected: 'Rejeitado'
                }[quotation.status]
              }
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Data de Criação</p>
            <p className="font-medium">
              {new Date(quotation.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Validade</p>
            <p className="font-medium">
              {new Date(quotation.validUntil).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Itens do Orçamento</h3>
          <div className="space-y-3">
            {quotation.items.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Produto</p>
                    <p className="font-medium">{item.productName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantidade</p>
                    <p className="font-medium">{item.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Preço Unitário</p>
                    <p className="font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(item.unitPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(item.total)}
                    </p>
                  </div>
                  {item.measurements && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Dimensões</p>
                      <p className="font-medium">
                        {item.measurements.length}m × {item.measurements.width}m × {item.measurements.thickness}m
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {quotation.services && quotation.services.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Serviços</h3>
            <div className="space-y-3">
              {quotation.services.map((service, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Serviço</p>
                      <p className="font-medium">{service.serviceName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Quantidade</p>
                      <p className="font-medium">{service.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Preço Unitário</p>
                      <p className="font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(service.unitPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(service.total)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Total do Orçamento</p>
            <p className="text-xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(quotation.total)}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            icon={Printer}
            onClick={() => onPrint(quotation)}
          >
            Imprimir
          </Button>
          
          {quotation.status === 'pending' && (
            <>
              <Button
                variant="danger"
                icon={X}
                onClick={() => handleStatusChange('rejected')}
              >
                Rejeitar
              </Button>
              <Button
                variant="primary"
                icon={Check}
                onClick={() => handleStatusChange('approved')}
              >
                Aprovar
              </Button>
            </>
          )}
          
          {quotation.status === 'approved' && !quotation.stockGenerated && (
            <Button
              variant="primary"
              icon={Package}
              onClick={handleGenerateStock}
            >
              Gerar Entrada no Estoque
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}