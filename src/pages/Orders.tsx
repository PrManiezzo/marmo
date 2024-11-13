import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, Package, Calendar, Printer } from 'lucide-react';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';
import TextArea from '../components/TextArea';
import SearchInput from '../components/SearchInput';
import { Order, OrderItem, OrderService } from '../types';
import { format } from 'date-fns';
import { useStore } from '../store';
import { generateOrderPDF } from '../utils/orderPdfGenerator';

export default function Orders() {
  const { orders, customers, products, services, addOrder, updateOrder, deleteOrder } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Order>>({
    items: [],
    services: [],
    status: 'pending',
    paymentStatus: 'pending'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.customerName.toLowerCase().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower) ||
      order.paymentStatus.toLowerCase().includes(searchLower) ||
      order.items.some(item => item.productName.toLowerCase().includes(searchLower))
    );
  });

  const columns = [
    {
      header: 'Pedido',
      accessor: 'id'
    },
    {
      header: 'Cliente',
      accessor: 'customerName'
    },
    {
      header: 'Status',
      accessor: (order: Order) => (
        <span className={`px-2 py-1 rounded-full text-sm ${{
            pending: 'bg-yellow-100 text-yellow-800',
            in_progress: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
          }[order.status]
          }`}>
          {
            {
              pending: 'Pendente',
              in_progress: 'Em Andamento',
              completed: 'Concluído',
              cancelled: 'Cancelado'
            }[order.status]
          }
        </span>
      )
    },
    {
      header: 'Pagamento',
      accessor: (order: Order) => (
        <span className={`px-2 py-1 rounded-full text-sm ${{
            pending: 'bg-yellow-100 text-yellow-800',
            partial: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800'
          }[order.paymentStatus]
          }`}>
          {
            {
              pending: 'Pendente',
              partial: 'Parcial',
              completed: 'Pago'
            }[order.paymentStatus]
          }
        </span>
      )
    },
    {
      header: 'Total',
      accessor: (order: Order) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(order.totalPrice)
    },
    {
      header: 'Entrega',
      accessor: (order: Order) => format(new Date(order.deliveryDate), 'dd/MM/yyyy')
    },
    {
      header: 'Ações',
      accessor: (order: Order) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            icon={Eye}
            onClick={() => handleView(order)}
          >
            Ver
          </Button>
          <Button
            variant="secondary"
            icon={Pencil}
            onClick={() => handleEdit(order)}
          >
            Editar
          </Button>
          <Button
            variant="secondary"
            icon={Printer}
            onClick={() => handlePrint(order)}
          >
            Imprimir
          </Button>
          <Button
            variant="danger"
            icon={Trash2}
            onClick={() => handleDelete(order.id)}
          >
            Excluir
          </Button>
        </div>
      )
    }
  ];

  const handleView = (order: Order) => {
    setViewingOrder(order);
    setIsModalOpen(true);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData(order);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      deleteOrder(id);
    }
  };

  const handlePrint = async (order: Order) => {
    try {
      await generateOrderPDF(order);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), {
        productId: '',
        productName: '',
        quantity: 1,
        price: 0
      }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index)
    }));
  };

  const handleAddService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...(prev.services || []), {
        serviceId: '',
        serviceName: '',
        quantity: 1,
        price: 0,
        observations: ''
      }]
    }));
  };

  const handleRemoveService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services?.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    setFormData(prev => {
      const items = [...(prev.items || [])];
      if (field === 'productId') {
        const product = products.find(p => p.id === value);
        if (product) {
          items[index] = {
            ...items[index],
            productId: value,
            productName: product.name,
            price: product.pricing.basePrice
          };
        }
      } else {
        items[index] = { ...items[index], [field]: value };
      }
      return { ...prev, items };
    });
  };

  const handleServiceChange = (index: number, field: keyof OrderService, value: any) => {
    setFormData(prev => {
      const services = [...(prev.services || [])];
      if (field === 'serviceId') {
        const selectedService = services.find(s => s.id === value);
        services[index] = {
          ...services[index],
          serviceId: value,
          serviceName: selectedService?.serviceName || '',
          price: selectedService?.price || 0
        };
      } else {
        services[index] = { ...services[index], [field]: value };
      }
      return { ...prev, services };
    });
  };

  const calculateTotal = () => {
    const itemsTotal = formData.items?.reduce((sum, item) =>
      sum + (item.price * item.quantity), 0) || 0;
    const servicesTotal = formData.services?.reduce((sum, service) =>
      sum + (service.price * service.quantity), 0) || 0;
    return itemsTotal + servicesTotal;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: Record<string, string> = {};

    if (!formData.customerId) {
      validationErrors.customerId = 'Selecione um cliente';
    }
    if (!formData.items?.length && !formData.services?.length) {
      validationErrors.items = 'Adicione pelo menos um produto ou serviço';
    }
    if (!formData.deliveryDate) {
      validationErrors.deliveryDate = 'Data de entrega é obrigatória';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const customer = customers.find(c => c.id === formData.customerId);
    if (!customer) return;

    const orderData: Order = {
      id: editingOrder?.id || `ORD${Date.now()}`,
      customerId: formData.customerId!,
      customerName: customer.fullName,
      items: formData.items || [],
      services: formData.services || [],
      status: formData.status || 'pending',
      totalPrice: calculateTotal(),
      createdAt: editingOrder?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deliveryDate: formData.deliveryDate!,
      installationDate: formData.installationDate,
      paymentStatus: formData.paymentStatus || 'pending',
      paymentMethod: formData.paymentMethod,
      observations: formData.observations
    };

    if (editingOrder) {
      updateOrder(editingOrder.id, orderData);
    } else {
      addOrder(orderData);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setViewingOrder(null);
    setEditingOrder(null);
    setFormData({
      items: [],
      services: [],
      status: 'pending',
      paymentStatus: 'pending'
    });
    setErrors({});
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pedidos</h1>
          <p className="text-gray-600">Gerencie os pedidos de clientes</p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Novo Pedido
        </Button>
      </div>

      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar por número do pedido, cliente, status ou produtos..."
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table columns={columns} data={filteredOrders} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={viewingOrder ? `Detalhes do Pedido #${viewingOrder.id}` : (editingOrder ? 'Editar Pedido' : 'Novo Pedido')}
      >
        {viewingOrder ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Informações do Pedido</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Data do Pedido</p>
                  <p className="font-medium">
                    {format(new Date(viewingOrder.createdAt), 'dd/MM/yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">
                    {viewingOrder.status.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor Total</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(viewingOrder.totalPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data de Entrega</p>
                  <p className="font-medium">
                    {format(new Date(viewingOrder.deliveryDate), 'dd/MM/yyyy')}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Itens do Pedido</h3>
              <div className="space-y-3">
                {viewingOrder.items.map((item, index) => (
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
                          }).format(item.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-medium">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {viewingOrder.services && viewingOrder.services.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Serviços</h3>
                <div className="space-y-3">
                  {viewingOrder.services.map((service, index) => (
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
                            }).format(service.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="font-medium">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(service.price * service.quantity)}
                          </p>
                        </div>
                        {service.observations && (
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Observações</p>
                            <p className="font-medium">{service.observations}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="secondary"
                icon={Printer}
                onClick={() => handlePrint(viewingOrder)}
              >
                Imprimir
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                Fechar
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Select
              label="Cliente"
              value={formData.customerId || ''}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
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
              {formData.items?.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div className="col-span-4 flex justify-end">
                    <Button
                      type="button"
                      variant="danger"
                      icon={Trash2}
                      onClick={() => handleRemoveItem(index)}
                    >
                      Remover
                    </Button>
                  </div>
                  <div className="col-span-2">
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
                  </div>
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
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
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
              {formData.services?.map((service, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div className="col-span-4 flex justify-end">
                    <Button
                      type="button"
                      variant="danger"
                      icon={Trash2}
                      onClick={() => handleRemoveService(index)}
                    >
                      Remover
                    </Button>
                  </div>
                  <div className="col-span-2">
                    <Select
                      label="Serviço"
                      value={service.serviceId}
                      onChange={(e) => {
                        const selectedService = services.find(s => s.id === e.target.value);
                        if (selectedService) {
                          handleServiceChange(index, 'serviceId', e.target.value);
                          handleServiceChange(index, 'serviceName', selectedService.name);
                          handleServiceChange(index, 'price', selectedService.basePrice);
                        }
                      }}
                      options={services.map(s => ({
                        value: s.id,
                        label: s.name
                      }))}
                      required
                    />
                  </div>
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
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, 'price', Number(e.target.value))}
                    required
                  />
                  <div className="col-span-4">
                    <TextArea
                      label="Observações"
                      value={service.observations || ''}
                      onChange={(e) => handleServiceChange(index, 'observations', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Status do Pedido"
                value={formData.status || 'pending'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: 'pending', label: 'Pendente' },
                  { value: 'in_progress', label: 'Em Andamento' },
                  { value: 'completed', label: 'Concluído' },
                  { value: 'cancelled', label: 'Cancelado' }
                ]}
                required
              />
              <Select
                label="Status do Pagamento"
                value={formData.paymentStatus || 'pending'}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                options={[
                  { value: 'pending', label: 'Pendente' },
                  { value: 'partial', label: 'Parcial' },
                  { value: 'completed', label: 'Pago' }
                ]}
                required
              />
            </div>

            <Select
              label="Forma de Pagamento"
              value={formData.paymentMethod || ''}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              options={[
                { value: 'credit_card', label: 'Cartão de Crédito' },
                { value: 'debit_card', label: 'Cartão de Débito' },
                { value: 'bank_transfer', label: 'Transferência Bancária' },
                { value: 'cash', label: 'Dinheiro' },
                { value: 'pix', label: 'PIX' }
              ]}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Data de Entrega"
                type="date"
                value={formData.deliveryDate?.split('T')[0] || ''}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                error={errors.deliveryDate}
                required
              />
              <Input
                label="Data de Instalação"
                type="date"
                value={formData.installationDate?.split('T')[0] || ''}
                onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
              />
            </div>

            <TextArea
              label="Observações"
              value={formData.observations || ''}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
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
                    setIsModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" icon={Package}>
                  {editingOrder ? 'Atualizar' : 'Criar'} Pedido
                </Button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}