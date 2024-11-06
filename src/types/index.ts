// Customer Types
export interface Customer {
  id: string;
  fullName: string;
  documentType: 'cpf' | 'cnpj';
  documentNumber: string;
  birthDate?: string;
  phones: {
    primary: string;
    secondary?: string;
  };
  emails: {
    primary: string;
    secondary?: string;
  };
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  code: string;
  barcode?: string;
  type: 'marble' | 'granite' | 'quartz' | 'porcelain';
  color: string;
  pattern: 'solid' | 'veined' | 'speckled' | 'mixed';
  finish: 'polished' | 'matte' | 'rustic' | 'flamed' | 'brushed';
  dimensions: {
    thickness: number;
    width: number;
    length: number;
    weight: number;
  };
  origin: {
    country: string;
    region?: string;
  };
  stock: {
    quantity: number;
    minQuantity: number;
    unit: 'm²' | 'piece' | 'slab';
    location?: string;
    status: 'available' | 'out_of_stock';
    pieces?: Array<{
      id: string;
      width: number;
      length: number;
      thickness: number;
    }>;
  };
  pricing: {
    basePrice: number;
    isOnSale: boolean;
    salePrice?: number;
    saleEndsAt?: string;
    specialPrices?: Array<{
      price: number;
      minQuantity: number;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

// Service Types
export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'measurement' | 'cutting' | 'installation' | 'restoration' | 'maintenance' | 'delivery';
  basePrice: number;
  priceUnit: 'm²' | 'linear_meter' | 'piece' | 'hour' | 'fixed';
  estimatedTime?: number;
  requiresMeasurement: boolean;
  requiresVisit: boolean;
}

// Order Types
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  measurements?: {
    length: number;
    width: number;
    thickness: number;
  };
}

export interface OrderService {
  serviceId: string;
  serviceName: string;
  quantity: number;
  price: number;
  observations?: string;
  scheduledDate?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  services: OrderService[];
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  deliveryDate: string;
  installationDate?: string;
  paymentStatus: 'pending' | 'partial' | 'completed';
  paymentMethod?: 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'pix';
  observations?: string;
}

// Quotation Types
export interface QuotationItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  measurements?: {
    length: number;
    width: number;
    thickness: number;
  };
}

export interface QuotationService {
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  observations?: string;
}

export interface Quotation {
  id: string;
  customerName: string;
  customerId: string;
  items: QuotationItem[];
  services: QuotationService[];
  total: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  validUntil: string;
  statusUpdatedAt?: string;
  stockGenerated?: boolean;
  stockGeneratedAt?: string;
  observations?: string;
  installationDate?: string;
  measurementDate?: string;
}