import { create } from 'zustand';
import { Customer, Product, Order, Quotation, Service } from '../types';

interface StockMovement {
  id: string;
  productId: string;
  type: 'entrada' | 'saida' | 'correcao';
  quantity: number;
  reason: string;
  date: string;
}

interface StoreState {
  customers: Customer[];
  products: Product[];
  orders: Order[];
  quotations: Quotation[];
  services: Service[];
  stockMovements: StockMovement[];
  
  // Customer actions
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  
  // Product actions
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  updateProductStock: (id: string, newQuantity: number) => void;
  deleteProduct: (id: string) => void;
  addProductPieces: (productId: string, pieces: Array<{ id: string; width: number; length: number; thickness: number; }>) => void;
  
  // Service actions
  addService: (service: Service) => void;
  updateService: (id: string, service: Service) => void;
  deleteService: (id: string) => void;
  
  // Order actions
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Order) => void;
  deleteOrder: (id: string) => void;
  
  // Quotation actions
  addQuotation: (quotation: Quotation) => void;
  updateQuotation: (id: string, quotation: Quotation) => void;
  deleteQuotation: (id: string) => void;
  
  // Stock actions
  addStockMovement: (movement: StockMovement) => void;
}

export const useStore = create<StoreState>((set) => ({
  customers: [],
  products: [],
  orders: [],
  quotations: [],
  services: [],
  stockMovements: [],

  // Customer actions
  addCustomer: (customer) =>
    set((state) => ({ customers: [...state.customers, customer] })),
  updateCustomer: (id, customer) =>
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? customer : c)),
    })),
  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    })),

  // Product actions
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  updateProduct: (product) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    })),
  updateProductStock: (id, newQuantity) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id
          ? {
              ...p,
              stock: {
                ...p.stock,
                quantity: newQuantity,
                status:
                  newQuantity <= p.stock.minQuantity
                    ? 'out_of_stock'
                    : 'available',
              },
            }
          : p
      ),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
  addProductPieces: (productId, pieces) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId
          ? {
              ...p,
              stock: {
                ...p.stock,
                pieces: [...(p.stock.pieces || []), ...pieces],
              },
            }
          : p
      ),
    })),

  // Service actions
  addService: (service) =>
    set((state) => ({ services: [...state.services, service] })),
  updateService: (id, service) =>
    set((state) => ({
      services: state.services.map((s) => (s.id === id ? service : s)),
    })),
  deleteService: (id) =>
    set((state) => ({
      services: state.services.filter((s) => s.id !== id),
    })),

  // Order actions
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  updateOrder: (id, order) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? order : o)),
    })),
  deleteOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((o) => o.id !== id),
    })),

  // Quotation actions
  addQuotation: (quotation) =>
    set((state) => ({ quotations: [...state.quotations, quotation] })),
  updateQuotation: (id, quotation) =>
    set((state) => ({
      quotations: state.quotations.map((q) => (q.id === id ? quotation : q)),
    })),
  deleteQuotation: (id) =>
    set((state) => ({
      quotations: state.quotations.filter((q) => q.id !== id),
    })),

  // Stock actions
  addStockMovement: (movement) =>
    set((state) => ({
      stockMovements: [...state.stockMovements, movement],
    })),
}));