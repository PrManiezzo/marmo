import React, { useState } from 'react';
import { Plus, Pencil, Trash2, User } from 'lucide-react';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import FormSection from '../components/FormSection';
import SearchInput from '../components/SearchInput';
import { Customer } from '../types';
import { generateId } from '../utils/format';
import { validateCustomerForm } from '../utils/validation';
import { maskCPF, maskCNPJ, maskPhone, maskZipCode } from '../utils/masks';
import { useStore } from '../store';

export default function Customers() {
  const customers = useStore((state) => state.customers);
  const addCustomer = useStore((state) => state.addCustomer);
  const updateCustomer = useStore((state) => state.updateCustomer);
  const deleteCustomer = useStore((state) => state.deleteCustomer);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({
    documentType: 'cpf',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.fullName.toLowerCase().includes(searchLower) ||
      customer.documentNumber.toLowerCase().includes(searchLower) ||
      customer.phones.primary.toLowerCase().includes(searchLower) ||
      customer.emails.primary.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      header: 'Nome',
      accessor: 'fullName',
    },
    {
      header: 'Documento',
      accessor: (customer: Customer) =>
        `${customer.documentType.toUpperCase()}: ${customer.documentNumber}`,
    },
    {
      header: 'Telefone',
      accessor: (customer: Customer) => customer.phones.primary,
    },
    {
      header: 'Email',
      accessor: (customer: Customer) => customer.emails.primary,
    },
    {
      header: 'Ações',
      accessor: (customer: Customer) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            icon={Pencil}
            onClick={() => handleEdit(customer)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            icon={Trash2}
            onClick={() => handleDelete(customer.id)}
          >
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteCustomer(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateCustomerForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const now = new Date().toISOString();
    const customerData: Customer = {
      id: editingCustomer?.id || generateId('cust'),
      ...(formData as Customer),
      createdAt: editingCustomer?.createdAt || now,
      updatedAt: now,
    };

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerData);
    } else {
      addCustomer(customerData);
    }

    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({ documentType: 'cpf' });
  };

  const handleInputChange = (field: string, value: string) => {
    let maskedValue = value;

    if (field === 'documentNumber') {
      maskedValue =
        formData.documentType === 'cpf' ? maskCPF(value) : maskCNPJ(value);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: maskedValue,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNestedInputChange = (
    parent: string,
    field: string,
    value: string
  ) => {
    let maskedValue = value;

    if (parent === 'phones' && field === 'primary') {
      maskedValue = maskPhone(value);
    } else if (parent === 'address' && field === 'zipCode') {
      maskedValue = maskZipCode(value);
    }

    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: maskedValue,
      },
    }));

    const errorKey = `${parent}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-gray-600">Gerencie o cadastro de clientes</p>
        </div>
        <Button
          icon={Plus}
          onClick={() => {
            setFormData({ documentType: 'cpf' });
            setIsModalOpen(true);
          }}
        >
          Novo Cliente
        </Button>
      </div>

      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar por nome, documento, telefone ou email..."
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table columns={columns} data={filteredCustomers} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCustomer(null);
          setFormData({ documentType: 'cpf' });
          setErrors({});
        }}
        title={editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Informações Pessoais">
            <Input
              label="Nome Completo"
              value={formData.fullName || ''}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              error={errors.fullName}
              required
              placeholder="Digite o nome completo"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Documento
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.documentType}
                  onChange={(e) => {
                    handleInputChange('documentType', e.target.value);
                    handleInputChange('documentNumber', '');
                  }}
                >
                  <option value="cpf">CPF</option>
                  <option value="cnpj">CNPJ</option>
                </select>
              </div>
              <Input
                label={formData.documentType?.toUpperCase()}
                value={formData.documentNumber || ''}
                onChange={(e) =>
                  handleInputChange('documentNumber', e.target.value)
                }
                error={errors.documentNumber}
                required
                placeholder={
                  formData.documentType === 'cpf'
                    ? '999.999.999-99'
                    : '99.999.999/9999-99'
                }
                maxLength={formData.documentType === 'cpf' ? 14 : 18}
              />
            </div>

            <Input
              label="Data de Nascimento"
              type="date"
              value={formData.birthDate || ''}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              error={errors.birthDate}
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </FormSection>

          <FormSection title="Contato">
            <Input
              label="Telefone Principal"
              value={formData.phones?.primary || ''}
              onChange={(e) =>
                handleNestedInputChange('phones', 'primary', e.target.value)
              }
              error={errors.primaryPhone}
              required
              placeholder="(99) 99999-9999"
              maxLength={15}
            />

            <Input
              label="Email Principal"
              type="email"
              value={formData.emails?.primary || ''}
              onChange={(e) =>
                handleNestedInputChange('emails', 'primary', e.target.value)
              }
              error={errors.primaryEmail}
              required
              placeholder="email@exemplo.com"
            />
          </FormSection>

          <FormSection title="Endereço">
            <Input
              label="CEP"
              value={formData.address?.zipCode || ''}
              onChange={(e) =>
                handleNestedInputChange('address', 'zipCode', e.target.value)
              }
              error={errors.zipCode}
              required
              placeholder="99999-999"
              maxLength={9}
            />

            <Input
              label="Logradouro"
              value={formData.address?.street || ''}
              onChange={(e) =>
                handleNestedInputChange('address', 'street', e.target.value)
              }
              error={errors.street}
              required
              placeholder="Digite o nome da rua"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Número"
                value={formData.address?.number || ''}
                onChange={(e) =>
                  handleNestedInputChange('address', 'number', e.target.value)
                }
                error={errors.number}
                required
                placeholder="Número"
              />
              <Input
                label="Complemento"
                value={formData.address?.complement || ''}
                onChange={(e) =>
                  handleNestedInputChange(
                    'address',
                    'complement',
                    e.target.value
                  )
                }
                placeholder="Apto, Sala, etc."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Bairro"
                value={formData.address?.neighborhood || ''}
                onChange={(e) =>
                  handleNestedInputChange(
                    'address',
                    'neighborhood',
                    e.target.value
                  )
                }
                error={errors.neighborhood}
                required
                placeholder="Digite o bairro"
              />
              <Input
                label="Cidade"
                value={formData.address?.city || ''}
                onChange={(e) =>
                  handleNestedInputChange('address', 'city', e.target.value)
                }
                error={errors.city}
                required
                placeholder="Digite a cidade"
              />
              <Input
                label="Estado"
                value={formData.address?.state || ''}
                onChange={(e) =>
                  handleNestedInputChange(
                    'address',
                    'state',
                    e.target.value.toUpperCase()
                  )
                }
                error={errors.state}
                required
                placeholder="SP"
                maxLength={2}
                style={{ textTransform: 'uppercase' }}
              />
            </div>
          </FormSection>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingCustomer(null);
                setFormData({ documentType: 'cpf' });
                setErrors({});
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" icon={User}>
              {editingCustomer ? 'Atualizar' : 'Cadastrar'} Cliente
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}