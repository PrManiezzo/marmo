import React, { useState } from 'react';
import { Ruler, Plus, Pencil, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Select from '../components/Select';
import Table from '../components/Table';
import { Service } from '../types';
import { useStore } from '../store';

export default function Services() {
  const { services, addService, updateService, deleteService } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({
    category: 'measurement',
    requiresMeasurement: false,
    requiresVisit: false,
    priceUnit: 'm²'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const columns = [
    { header: 'Nome', accessor: 'name' },
    {
      header: 'Categoria', accessor: (service: Service) => {
        const categories = {
          measurement: 'Medição',
          cutting: 'Corte',
          installation: 'Instalação',
          restoration: 'Restauração',
          maintenance: 'Manutenção',
          delivery: 'Entrega'
        };
        return categories[service.category];
      }
    },
    {
      header: 'Preço Base',
      accessor: (service: Service) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(service.basePrice)
    },
    {
      header: 'Unidade', accessor: (service: Service) => {
        const units = {
          'm²': 'Metro Quadrado',
          'linear_meter': 'Metro Linear',
          'piece': 'Peça',
          'hour': 'Hora',
          'fixed': 'Fixo'
        };
        return units[service.priceUnit];
      }
    },
    {
      header: 'Ações',
      accessor: (service: Service) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            icon={Pencil}
            onClick={() => handleEdit(service)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            icon={Trash2}
            onClick={() => handleDelete(service.id)}
          >
            Excluir
          </Button>
        </div>
      )
    }
  ];

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData(service);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteService(id);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!formData.description?.trim()) {
      errors.description = 'Descrição é obrigatória';
    }

    if (!formData.basePrice || formData.basePrice <= 0) {
      errors.basePrice = 'Preço base deve ser maior que zero';
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const serviceData: Service = {
      id: editingService?.id || `service-${Date.now()}`,
      ...formData as Service
    };

    if (editingService) {
      updateService(serviceData.id, serviceData);
    } else {
      addService(serviceData);
    }

    setIsModalOpen(false);
    setEditingService(null);
    setFormData({
      category: 'measurement',
      requiresMeasurement: false,
      requiresVisit: false,
      priceUnit: 'm²'
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Serviços</h1>
          <p className="text-gray-600">Gerencie os serviços oferecidos</p>
        </div>
        <Button
          icon={Plus}
          onClick={() => {
            setFormData({
              category: 'measurement',
              requiresMeasurement: false,
              requiresVisit: false,
              priceUnit: 'm²'
            });
            setIsModalOpen(true);
          }}
        >
          Novo Serviço
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table columns={columns} data={services} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
          setFormData({
            category: 'measurement',
            requiresMeasurement: false,
            requiresVisit: false,
            priceUnit: 'm²'
          });
          setErrors({});
        }}
        title={editingService ? 'Editar Serviço' : 'Novo Serviço'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome do Serviço"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
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

          <Select
            label="Categoria"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'measurement', label: 'Medição' },
              { value: 'cutting', label: 'Corte' },
              { value: 'installation', label: 'Instalação' },
              { value: 'restoration', label: 'Restauração' },
              { value: 'maintenance', label: 'Manutenção' },
              { value: 'delivery', label: 'Entrega' }
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Preço Base"
              type="number"
              step="0.01"
              value={formData.basePrice || ''}
              onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
              error={errors.basePrice}
              required
            />

            <Select
              label="Unidade de Preço"
              value={formData.priceUnit}
              onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
              options={[
                { value: 'm²', label: 'Metro Quadrado' },
                { value: 'linear_meter', label: 'Metro Linear' },
                { value: 'piece', label: 'Peça' },
                { value: 'hour', label: 'Hora' },
                { value: 'fixed', label: 'Fixo' }
              ]}
              required
            />
          </div>

          <Input
            label="Tempo Estimado (horas)"
            type="number"
            step="0.5"
            value={formData.estimatedTime || ''}
            onChange={(e) => setFormData({ ...formData, estimatedTime: parseFloat(e.target.value) })}
          />

          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.requiresMeasurement}
                onChange={(e) => setFormData({ ...formData, requiresMeasurement: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Requer Medição</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.requiresVisit}
                onChange={(e) => setFormData({ ...formData, requiresVisit: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Requer Visita Técnica</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingService(null);
                setFormData({
                  category: 'measurement',
                  requiresMeasurement: false,
                  requiresVisit: false,
                  priceUnit: 'm²'
                });
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" icon={Ruler}>
              {editingService ? 'Atualizar' : 'Cadastrar'} Serviço
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}