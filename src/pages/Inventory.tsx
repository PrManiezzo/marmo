import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, History } from 'lucide-react';
import Table from '../components/Table';
import Button from '../components/Button';
import SearchInput from '../components/SearchInput';
import InventoryAdjustmentModal from '../components/inventory/InventoryAdjustmentModal';
import PiecesEntryModal from '../components/inventory/PiecesEntryModal';
import { useStore } from '../store';

export default function Inventory() {
  const { products } = useStore();
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isPiecesModalOpen, setIsPiecesModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.code.toLowerCase().includes(searchLower) ||
      product.type.toLowerCase().includes(searchLower) ||
      (product.stock.location || '').toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    { header: 'Produto', accessor: 'name' },
    { 
      header: 'Quantidade', 
      accessor: (product) => `${product.stock.quantity} ${product.stock.unit}`
    },
    { 
      header: 'Peças', 
      accessor: (product) => product.stock.pieces?.length || 0
    },
    { header: 'Localização', accessor: (product) => product.stock.location || '-' },
    {
      header: 'Status',
      accessor: (product) => (
        <div className="flex items-center">
          {product.stock.quantity <= product.stock.minQuantity ? (
            <div className="flex items-center text-amber-600">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Estoque Baixo
            </div>
          ) : (
            <div className="text-green-600">
              Normal
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Ações',
      accessor: (product) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            icon={Plus}
            onClick={() => handleAdjustmentClick(product.id)}
          >
            Ajustar
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

  const handleAdjustmentClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsAdjustmentModalOpen(true);
  };

  const handlePiecesClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsPiecesModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Controle de Estoque</h1>
          <p className="text-gray-600">Gerencie o estoque de produtos</p>
        </div>
      </div>

      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar por nome do produto, código, tipo ou localização..."
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table columns={columns} data={filteredProducts} />
      </div>

      <InventoryAdjustmentModal
        isOpen={isAdjustmentModalOpen}
        onClose={() => setIsAdjustmentModalOpen(false)}
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