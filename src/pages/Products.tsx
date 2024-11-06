import React, { useState } from 'react';
import { Plus, Package, ArrowUp, Warehouse, AlertTriangle } from 'lucide-react';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ProductForm from '../components/ProductForm';
import SearchInput from '../components/SearchInput';
import { Product } from '../types';
import { generateId } from '../utils/format';
import { validateProductForm } from '../utils/productValidation';
import { useStore } from '../store';
import InventoryAdjustmentModal from '../components/inventory/InventoryAdjustmentModal';
import PiecesEntryModal from '../components/inventory/PiecesEntryModal';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isPiecesModalOpen, setIsPiecesModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Product>>({
    type: 'marble',
    pattern: 'solid',
    finish: 'polished',
    stock: {
      unit: 'm²',
      status: 'available'
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const columns = [
    { header: 'Código', accessor: 'code' },
    { header: 'Nome', accessor: 'name' },
    { 
      header: 'Tipo', 
      accessor: (product: Product) => {
        const types = {
          marble: 'Mármore',
          granite: 'Granito',
          quartz: 'Quartzo',
          porcelain: 'Porcelanato'
        };
        return types[product.type];
      }
    },
    {
      header: 'Estoque',
      accessor: (product: Product) => (
        <div className="flex items-center">
          <span className={`mr-2 ${
            product.stock.quantity <= product.stock.minQuantity 
              ? 'text-red-600' 
              : 'text-green-600'
          }`}>
            {product.stock.quantity} {product.stock.unit}
          </span>
          {product.stock.quantity <= product.stock.minQuantity && (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
              Baixo
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Preço Base',
      accessor: (product: Product) => 
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(product.pricing.basePrice)
    },
    {
      header: 'Ações',
      accessor: (product: Product) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            icon={ArrowUp}
            onClick={() => handleInventoryClick(product.id)}
          >
            Ajustar Estoque
          </Button>
          <Button
            variant="secondary"
            icon={Package}
            onClick={() => handlePiecesClick(product.id)}
          >
            Peças
          </Button>
        </div>
      )
    }
  ];

  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.code.toLowerCase().includes(searchLower) ||
      product.type.toLowerCase().includes(searchLower) ||
      product.color.toLowerCase().includes(searchLower)
    );
  });

  const handleInventoryClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsInventoryModalOpen(true);
  };

  const handlePiecesClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsPiecesModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateProductForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) return;

    const now = new Date().toISOString();
    const productData: Product = {
      id: editingProduct?.id || generateId('prod'),
      ...formData as Product,
      createdAt: editingProduct?.createdAt || now,
      updatedAt: now
    };

    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }

    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      type: 'marble',
      pattern: 'solid',
      finish: 'polished',
      stock: {
        unit: 'm²',
        status: 'available'
      }
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));

    const errorKey = `${parent}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
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
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-gray-600">Gerencie o catálogo de produtos</p>
        </div>
        <Button 
          icon={Plus} 
          onClick={() => {
            setFormData({
              type: 'marble',
              pattern: 'solid',
              finish: 'polished',
              stock: {
                unit: 'm²',
                status: 'available'
              }
            });
            setIsModalOpen(true);
          }}
        >
          Novo Produto
        </Button>
      </div>

      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar por nome, código, tipo ou cor..."
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table columns={columns} data={filteredProducts} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
          setFormData({
            type: 'marble',
            pattern: 'solid',
            finish: 'polished',
            stock: {
              unit: 'm²',
              status: 'available'
            }
          });
          setErrors({});
        }}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <ProductForm
            data={formData}
            errors={errors}
            onChange={handleInputChange}
            onNestedChange={handleNestedInputChange}
          />

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingProduct(null);
                setFormData({
                  type: 'marble',
                  pattern: 'solid',
                  finish: 'polished',
                  stock: {
                    unit: 'm²',
                    status: 'available'
                  }
                });
                setErrors({});
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" icon={Package}>
              {editingProduct ? 'Atualizar' : 'Cadastrar'} Produto
            </Button>
          </div>
        </form>
      </Modal>

      <InventoryAdjustmentModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        productId={selectedProductId}
      />

      <PiecesEntryModal
        isOpen={isPiecesModalOpen}
        onClose={() => setIsPiecesModalOpen(false)}
        productId={selectedProductId}
      />
    </div>
  );
}