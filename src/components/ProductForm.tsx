import React from 'react';
import Input from './Input';
import Select from './Select';
import FormSection from './FormSection';
import { Product } from '../types';

interface ProductFormProps {
  data: Partial<Product>;
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
  onNestedChange: (parent: string, field: string, value: any) => void;
}

export default function ProductForm({ data, errors, onChange, onNestedChange }: ProductFormProps) {
  const materialTypes = [
    { value: 'marble', label: 'Mármore' },
    { value: 'granite', label: 'Granito' },
    { value: 'quartz', label: 'Quartzo' },
    { value: 'porcelain', label: 'Porcelanato' }
  ];

  const patterns = [
    { value: 'solid', label: 'Sólido' },
    { value: 'veined', label: 'Rajado' },
    { value: 'speckled', label: 'Mesclado' },
    { value: 'mixed', label: 'Misto' }
  ];

  const finishes = [
    { value: 'polished', label: 'Polido' },
    { value: 'matte', label: 'Fosco' },
    { value: 'rustic', label: 'Rústico' },
    { value: 'flamed', label: 'Flameado' },
    { value: 'brushed', label: 'Escovado' }
  ];

  return (
    <div className="space-y-6">
      <FormSection title="Informações Básicas">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nome do Produto"
            value={data.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            error={errors.name}
            required
          />
          <Input
            label="Código do Produto"
            value={data.code || ''}
            onChange={(e) => onChange('code', e.target.value)}
            error={errors.code}
            required
          />
        </div>
        <Input
          label="Código de Barras (opcional)"
          value={data.barcode || ''}
          onChange={(e) => onChange('barcode', e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Tipo de Material"
            value={data.type || ''}
            onChange={(e) => onChange('type', e.target.value)}
            options={materialTypes}
            error={errors.type}
            required
          />
          <Input
            label="Cor"
            value={data.color || ''}
            onChange={(e) => onChange('color', e.target.value)}
            error={errors.color}
            required
          />
        </div>
        <Select
          label="Padrão"
          value={data.pattern || ''}
          onChange={(e) => onChange('pattern', e.target.value)}
          options={patterns}
          error={errors.pattern}
          required
        />
      </FormSection>

      <FormSection title="Origem">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="País"
            value={data.origin?.country || ''}
            onChange={(e) => onNestedChange('origin', 'country', e.target.value)}
            error={errors.country}
            required
          />
          <Input
            label="Região (opcional)"
            value={data.origin?.region || ''}
            onChange={(e) => onNestedChange('origin', 'region', e.target.value)}
          />
        </div>
      </FormSection>

      <FormSection title="Dimensões e Acabamento">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Espessura (mm)"
            type="number"
            value={data.dimensions?.thickness || ''}
            onChange={(e) => onNestedChange('dimensions', 'thickness', Number(e.target.value))}
            error={errors.thickness}
            required
          />
          <Input
            label="Peso (kg/m²)"
            type="number"
            value={data.dimensions?.weight || ''}
            onChange={(e) => onNestedChange('dimensions', 'weight', Number(e.target.value))}
            error={errors.weight}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Largura (m)"
            type="number"
            step="0.01"
            value={data.dimensions?.width || ''}
            onChange={(e) => onNestedChange('dimensions', 'width', Number(e.target.value))}
            error={errors.width}
            required
          />
          <Input
            label="Comprimento (m)"
            type="number"
            step="0.01"
            value={data.dimensions?.length || ''}
            onChange={(e) => onNestedChange('dimensions', 'length', Number(e.target.value))}
            error={errors.length}
            required
          />
        </div>
        <Select
          label="Acabamento"
          value={data.finish || ''}
          onChange={(e) => onChange('finish', e.target.value)}
          options={finishes}
          error={errors.finish}
          required
        />
      </FormSection>

      <FormSection title="Estoque">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantidade"
            type="number"
            step="0.01"
            value={data.stock?.quantity || ''}
            onChange={(e) => onNestedChange('stock', 'quantity', Number(e.target.value))}
            error={errors.quantity}
            required
          />
          <Select
            label="Unidade"
            value={data.stock?.unit || ''}
            onChange={(e) => onNestedChange('stock', 'unit', e.target.value)}
            options={[
              { value: 'm²', label: 'Metro Quadrado' },
              { value: 'piece', label: 'Peça' },
              { value: 'slab', label: 'Chapa' }
            ]}
            error={errors.unit}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantidade Mínima"
            type="number"
            step="0.01"
            value={data.stock?.minQuantity || ''}
            onChange={(e) => onNestedChange('stock', 'minQuantity', Number(e.target.value))}
            error={errors.minQuantity}
            required
          />
          <Input
            label="Localização no Estoque"
            value={data.stock?.location || ''}
            onChange={(e) => onNestedChange('stock', 'location', e.target.value)}
            placeholder="Ex: Setor A, Prateleira 1"
          />
        </div>
      </FormSection>

      <FormSection title="Preços">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Preço Base (R$)"
            type="number"
            step="0.01"
            value={data.pricing?.basePrice || ''}
            onChange={(e) => onNestedChange('pricing', 'basePrice', Number(e.target.value))}
            error={errors.basePrice}
            required
          />
          <div className="flex items-center space-x-2 pt-7">
            <input
              type="checkbox"
              checked={data.pricing?.isOnSale || false}
              onChange={(e) => onNestedChange('pricing', 'isOnSale', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Produto em Promoção</span>
          </div>
        </div>
        
        {data.pricing?.isOnSale && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Preço Promocional (R$)"
              type="number"
              step="0.01"
              value={data.pricing?.salePrice || ''}
              onChange={(e) => onNestedChange('pricing', 'salePrice', Number(e.target.value))}
              error={errors.salePrice}
              required
            />
            <Input
              label="Promoção até"
              type="date"
              value={data.pricing?.saleEndsAt?.split('T')[0] || ''}
              onChange={(e) => onNestedChange('pricing', 'saleEndsAt', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        )}
      </FormSection>
    </div>
  );
}