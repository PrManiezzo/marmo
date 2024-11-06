import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import Modal from '../Modal';
import Input from '../Input';
import Select from '../Select';
import TextArea from '../TextArea';
import Button from '../Button';
import { useStore } from '../../store';
import { QuotationItem, QuotationService } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuotationModal({ isOpen, onClose }: Props) {
  const { customers, products, services, addQuotation } = useStore();
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [selectedServices, setSelectedServices] = useState<QuotationService[]>([]);
  const [observations, setObservations] = useState('');
  const [measurementDate, setMeasurementDate] = useState('');
  const [installationDate, setInstallationDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddItem = () => {
    setItems([...items, {
      productId: '',
      productName: '',
      quantity: 0,
      unitPrice: 0,
      total: 0
    }]);
  };

  const handleAddService = () => {
    setSelectedServices([...selectedServices, {
      serviceId: '',
      serviceName: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }]);
  };

  const handleItemChange = (index: number, field: keyof QuotationItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        item.productName = product.name;
        item.unitPrice = product.pricing.basePrice;
      }
    }

    item[field] = value;
    item.total = item.quantity * item.unitPrice;
    newItems[index] = item;
    setItems(newItems);
  };

  const handleServiceChange = (index: number, field: keyof QuotationService, value: any) => {
    const newServices = [...selectedServices];
    const service = { ...newServices[index] };

    if (field === 'serviceId') {
      const selectedService = services.find(s => s.id === value);
      if (selectedService) {
        service.serviceName = selectedService.name;
        service.unitPrice = selectedService.basePrice;
      }
    }

    service[field] = value;
    service.total = service.quantity * service.unitPrice;
    newServices[index] = service;
    setSelectedServices(newServices);
  };

  const calculateTotal = () => {
    const itemsTotal = items.reduce((sum, item) => sum + item.total, 0);
    const servicesTotal = selectedServices.reduce((sum, service) => sum + service.total, 0);
    return itemsTotal + servicesTotal;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: Record<string, string> = {};

    if (!customerId) validationErrors.customerId = 'Selecione um cliente';
    if (items.length === 0 && selectedServices.length === 0) {
      validationErrors.items = 'Adicione pelo menos um produto ou serviço';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const quotation = {
      id: `QT${Date.now()}`,
      customerId,
      customerName: customer.fullName,
      items,
      services: selectedServices,
      total: calculateTotal(),
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      observations,
      measurementDate,
      installationDate
    };

    addQuotation(quotation);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setCustomerId('');
    setItems([]);
    setSelectedServices([]);
    setObservations('');
    setMeasurementDate('');
    setInstallationDate('');
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        resetForm();
      }}
      title="Novo Orçamento"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Select
          label="Cliente"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          options={customers.map(customer => ({
            value: customer.id,
            label: customer.fullName
          }))}
          error={errors.customerId}
          required
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Produtos</h3>
            <Button type="button" variant="secondary" onClick={handleAddItem}>
              Adicionar Produto
            </Button>
          </div>
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
              <Select
                label="Produto"
                value={item.productId}
                onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                options={products.map(product => ({
                  value: product.id,
                  label: product.name
                }))}
                required
              />
              <Input
                label="Quantidade"
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                required
              />
              <Input
                label="Preço Unitário"
                type="number"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                required
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Serviços</h3>
            <Button type="button" variant="secondary" onClick={handleAddService}>
              Adicionar Serviço
            </Button>
          </div>
          {selectedServices.map((service, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
              <Select
                label="Serviço"
                value={service.serviceId}
                onChange={(e) => handleServiceChange(index, 'serviceId', e.target.value)}
                options={services.map(s => ({
                  value: s.id,
                  label: s.name
                }))}
                required
              />
              <Input
                label="Quantidade"
                type="number"
                value={service.quantity}
                onChange={(e) => handleServiceChange(index, 'quantity', Number(e.target.value))}
                required
              />
              <Input
                label="Preço Unitário"
                type="number"
                value={service.unitPrice}
                onChange={(e) => handleServiceChange(index, 'unitPrice', Number(e.target.value))}
                required
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Data da Medição"
            type="date"
            value={measurementDate}
            onChange={(e) => setMeasurementDate(e.target.value)}
          />
          <Input
            label="Data de Instalação"
            type="date"
            value={installationDate}
            onChange={(e) => setInstallationDate(e.target.value)}
          />
        </div>

        <TextArea
          label="Observações"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          rows={3}
        />

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-lg font-medium">
            Total: {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(calculateTotal())}
          </div>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                onClose();
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" icon={Calculator}>
              Gerar Orçamento
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}