import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Quotations from './pages/Quotations';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Services from './pages/Services';
import Cash from './pages/Cash';
import { useStore } from './store';
import { useCashStore } from './store/cashStore';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  const { 
    loadCustomers, 
    loadProducts, 
    loadServices, 
    loadOrders, 
    loadQuotations,
    loadStockMovements 
  } = useStore();
  
  const { loadTransactions } = useCashStore();

  useEffect(() => {
    loadCustomers();
    loadProducts();
    loadServices();
    loadOrders();
    loadQuotations();
    loadStockMovements();
    loadTransactions();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/app/*"
          element={
            <PrivateRoute>
              <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/produtos" element={<Products />} />
                    <Route path="/clientes" element={<Customers />} />
                    <Route path="/pedidos" element={<Orders />} />
                    <Route path="/estoque" element={<Inventory />} />
                    <Route path="/orcamentos" element={<Quotations />} />
                    <Route path="/servicos" element={<Services />} />
                    <Route path="/caixa" element={<Cash />} />
                    <Route path="/relatorios" element={<Reports />} />
                    <Route path="/configuracoes" element={<Settings />} />
                  </Routes>
                </main>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;