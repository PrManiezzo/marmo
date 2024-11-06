import { Product } from '../types';

interface ValidationErrors {
  [key: string]: string;
}

export const validateProductForm = (data: Partial<Product>): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Basic Information
  if (!data.name?.trim()) {
    errors.name = 'Nome do produto é obrigatório';
  }

  if (!data.code?.trim()) {
    errors.code = 'Código do produto é obrigatório';
  }

  // Dimensions
  if (data.dimensions) {
    if (!data.dimensions.thickness || data.dimensions.thickness <= 0) {
      errors.thickness = 'Espessura deve ser maior que 0';
    }
    if (!data.dimensions.width || data.dimensions.width <= 0) {
      errors.width = 'Largura deve ser maior que 0';
    }
    if (!data.dimensions.length || data.dimensions.length <= 0) {
      errors.length = 'Comprimento deve ser maior que 0';
    }
    if (!data.dimensions.weight || data.dimensions.weight <= 0) {
      errors.weight = 'Peso deve ser maior que 0';
    }
  } else {
    errors.dimensions = 'Dimensões são obrigatórias';
  }

  // Origin
  if (!data.origin?.country?.trim()) {
    errors.country = 'País de origem é obrigatório';
  }

  // Stock
  if (data.stock) {
    if (data.stock.quantity < 0) {
      errors.quantity = 'Quantidade não pode ser negativa';
    }
    if (data.stock.minQuantity < 0) {
      errors.minQuantity = 'Quantidade mínima não pode ser negativa';
    }
  } else {
    errors.stock = 'Informações de estoque são obrigatórias';
  }

  // Pricing
  if (data.pricing) {
    if (!data.pricing.basePrice || data.pricing.basePrice <= 0) {
      errors.basePrice = 'Preço base deve ser maior que 0';
    }
    
    if (data.pricing.isOnSale && (!data.pricing.salePrice || data.pricing.salePrice <= 0)) {
      errors.salePrice = 'Preço promocional deve ser maior que 0';
    }

    if (data.pricing.specialPrices) {
      data.pricing.specialPrices.forEach((price, index) => {
        if (price.price <= 0) {
          errors[`specialPrice_${index}`] = 'Preço especial deve ser maior que 0';
        }
        if (price.minQuantity <= 0) {
          errors[`specialPriceQuantity_${index}`] = 'Quantidade mínima deve ser maior que 0';
        }
      });
    }
  } else {
    errors.pricing = 'Informações de preço são obrigatórias';
  }

  return errors;
};