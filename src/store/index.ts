import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  getFirestore
} from 'firebase/firestore';
import { db } from '../config/firebase';
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
  addCustomer: (customer: Customer) => Promise<void>;
  updateCustomer: (id: string, customer: Customer) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  loadCustomers: () => Promise<void>;
  
  // Product actions
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  updateProductStock: (id: string, newQuantity: number) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loadProducts: () => Promise<void>;
  addProductPieces: (productId: string, pieces: Array<{ id: string; width: number; length: number; thickness: number; }>) => Promise<void>;
  
  // Service actions
  addService: (service: Service) => Promise<void>;
  updateService: (id: string, service: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  loadServices: () => Promise<void>;
  
  // Order actions
  addOrder: (order: Order) => Promise<void>;
  updateOrder: (id: string, order: Order) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  loadOrders: () => Promise<void>;
  
  // Quotation actions
  addQuotation: (quotation: Quotation) => Promise<void>;
  updateQuotation: (id: string, quotation: Quotation) => Promise<void>;
  deleteQuotation: (id: string) => Promise<void>;
  loadQuotations: () => Promise<void>;
  
  // Stock actions
  addStockMovement: (movement: StockMovement) => Promise<void>;
  loadStockMovements: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  customers: [],
  products: [],
  orders: [],
  quotations: [],
  services: [],
  stockMovements: [],

  // Load data
  loadCustomers: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'customers'));
      const customers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
      set({ customers });
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  },

  loadProducts: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      set({ products });
    } catch (error) {
      console.error('Error loading products:', error);
    }
  },

  loadServices: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const services = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
      set({ services });
    } catch (error) {
      console.error('Error loading services:', error);
    }
  },

  loadOrders: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      set({ orders });
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  },

  loadQuotations: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'quotations'));
      const quotations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quotation));
      set({ quotations });
    } catch (error) {
      console.error('Error loading quotations:', error);
    }
  },

  loadStockMovements: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'stockMovements'));
      const stockMovements = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StockMovement));
      set({ stockMovements });
    } catch (error) {
      console.error('Error loading stock movements:', error);
    }
  },

  // Customer actions
  addCustomer: async (customer) => {
    try {
      const docRef = await addDoc(collection(db, 'customers'), customer);
      const newCustomer = { ...customer, id: docRef.id };
      set(state => ({ customers: [...state.customers, newCustomer] }));
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  },

  updateCustomer: async (id, customer) => {
    try {
      await updateDoc(doc(db, 'customers', id), customer);
      set(state => ({
        customers: state.customers.map(c => c.id === id ? customer : c)
      }));
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    try {
      await deleteDoc(doc(db, 'customers', id));
      set(state => ({
        customers: state.customers.filter(c => c.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  // Product actions
  addProduct: async (product) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), product);
      const newProduct = { ...product, id: docRef.id };
      set(state => ({ products: [...state.products, newProduct] }));
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  updateProduct: async (product) => {
    try {
      await updateDoc(doc(db, 'products', product.id), product);
      set(state => ({
        products: state.products.map(p => p.id === product.id ? product : p)
      }));
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  updateProductStock: async (id, newQuantity) => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        'stock.quantity': newQuantity,
        'stock.status': newQuantity <= 0 ? 'out_of_stock' : 'available'
      });
      
      set(state => ({
        products: state.products.map(p =>
          p.id === id
            ? {
                ...p,
                stock: {
                  ...p.stock,
                  quantity: newQuantity,
                  status: newQuantity <= p.stock.minQuantity ? 'out_of_stock' : 'available',
                },
              }
            : p
        ),
      }));
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      set(state => ({
        products: state.products.filter(p => p.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  addProductPieces: async (productId, pieces) => {
    try {
      const productRef = doc(db, 'products', productId);
      const product = get().products.find(p => p.id === productId);
      if (!product) return;

      const updatedPieces = [...(product.stock.pieces || []), ...pieces];
      await updateDoc(productRef, {
        'stock.pieces': updatedPieces
      });

      set(state => ({
        products: state.products.map(p =>
          p.id === productId
            ? {
                ...p,
                stock: {
                  ...p.stock,
                  pieces: updatedPieces,
                },
              }
            : p
        ),
      }));
    } catch (error) {
      console.error('Error adding product pieces:', error);
      throw error;
    }
  },

  // Service actions
  addService: async (service) => {
    try {
      const docRef = await addDoc(collection(db, 'services'), service);
      const newService = { ...service, id: docRef.id };
      set(state => ({ services: [...state.services, newService] }));
    } catch (error) {
      console.error('Error adding service:', error);
      throw error;
    }
  },

  updateService: async (id, service) => {
    try {
      await updateDoc(doc(db, 'services', id), service);
      set(state => ({
        services: state.services.map(s => s.id === id ? service : s)
      }));
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  deleteService: async (id) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      set(state => ({
        services: state.services.filter(s => s.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  },

  // Order actions
  addOrder: async (order) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), order);
      const newOrder = { ...order, id: docRef.id };
      set(state => ({ orders: [...state.orders, newOrder] }));
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },

  updateOrder: async (id, order) => {
    try {
      await updateDoc(doc(db, 'orders', id), order);
      set(state => ({
        orders: state.orders.map(o => o.id === id ? order : o)
      }));
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  deleteOrder: async (id) => {
    try {
      await deleteDoc(doc(db, 'orders', id));
      set(state => ({
        orders: state.orders.filter(o => o.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  // Quotation actions
  addQuotation: async (quotation) => {
    try {
      const docRef = await addDoc(collection(db, 'quotations'), quotation);
      const newQuotation = { ...quotation, id: docRef.id };
      set(state => ({ quotations: [...state.quotations, newQuotation] }));
    } catch (error) {
      console.error('Error adding quotation:', error);
      throw error;
    }
  },

  updateQuotation: async (id, quotation) => {
    try {
      await updateDoc(doc(db, 'quotations', id), quotation);
      set(state => ({
        quotations: state.quotations.map(q => q.id === id ? quotation : q)
      }));
    } catch (error) {
      console.error('Error updating quotation:', error);
      throw error;
    }
  },

  deleteQuotation: async (id) => {
    try {
      await deleteDoc(doc(db, 'quotations', id));
      set(state => ({
        quotations: state.quotations.filter(q => q.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting quotation:', error);
      throw error;
    }
  },

  // Stock actions
  addStockMovement: async (movement) => {
    try {
      const docRef = await addDoc(collection(db, 'stockMovements'), movement);
      const newMovement = { ...movement, id: docRef.id };
      set(state => ({
        stockMovements: [...state.stockMovements, newMovement]
      }));
    } catch (error) {
      console.error('Error adding stock movement:', error);
      throw error;
    }
  }
}));