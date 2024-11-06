import React, { useState } from 'react';
import { Calculator, FileText, Package, Printer, History } from 'lucide-react';
import Table from '../components/Table';
import Button from '../components/Button';
import QuotationModal from '../components/quotations/QuotationModal';
import QuotationDetailsModal from '../components/quotations/QuotationDetailsModal';
import SearchInput from '../components/SearchInput';
import { useStore } from '../store';
import { Quotation } from '../types';
import { generateQuotationPDF } from '../utils/pdfGenerator';

export default function Quotations() {
  const { quotations } = useStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuotations = quotations.filter(quotation => {
    const searchLower = searchTerm.toLowerCase();
    return (
      quotation.id.toLowerCase().includes(searchLower) ||
      quotation.customerName.toLowerCase().includes(searchLower) ||
      quotation.status.toLowerCase().includes(searchLower) ||
      quotation.items.some(item => item.productName.toLowerCase().includes(searchLower))
    );
  });

  const columns = [
    { header: 'Nº Orçamento', accessor: 'id' },
    { header: 'Cliente', accessor: 'customerName' },
    {
      header: 'Valor Total',
      accessor: (quotation: Quotation) =>
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(quotation.total)
    },
    {
      header: 'Status',
      accessor: (quotation: Quotation) => (
        <span className={`px-2 py-1 rounded-full text-sm ${{
          pending: 'bg-yellow-100 text-yellow-800',
          approved: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800'
        }[quotation.status]
          }`}>
          {
            {
              pending: 'Pendente',
              approved: 'Aprovado',
              rejected: 'Rejeitado'
            }[quotation.status]
          }
        </span>
      )
    },
    {
      header: 'Validade',
      accessor: (quotation: Quotation) =>
        new Date(quotation.validUntil).toLocaleDateString('pt-BR')
    },
    {
      header: 'Ações',
      accessor: (quotation: Quotation) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            icon={FileText}
            onClick={() => handleViewDetails(quotation)}
          >
            Visualizar
          </Button>
          <Button
            variant="secondary"
            icon={Printer}
            onClick={() => handlePrintQuotation(quotation)}
          >
            Imprimir
          </Button>
          {quotation.status === 'approved' && !quotation.stockGenerated && (
            <Button
              variant="primary"
              icon={Package}
              onClick={() => handleViewDetails(quotation)}
            >
              Gerar Entrada
            </Button>
          )}
        </div>
      )
    }
  ];

  const handleViewDetails = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setIsDetailsModalOpen(true);
  };

  const handlePrintQuotation = async (quotation: Quotation) => {
    try {
      await generateQuotationPDF(quotation);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orçamentos</h1>
          <p className="text-gray-600">Gerencie os orçamentos para clientes</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            icon={History}
            onClick={() => {/* Implement history view */ }}
          >
            Histórico
          </Button>
          <Button
            icon={Calculator}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Novo Orçamento
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar por número do orçamento, cliente, status ou produtos..."
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table columns={columns} data={filteredQuotations} />
      </div>

      <QuotationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <QuotationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedQuotation(null);
        }}
        quotation={selectedQuotation}
        onPrint={handlePrintQuotation}
      />
    </div>
  );
}