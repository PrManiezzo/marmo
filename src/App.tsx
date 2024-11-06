import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
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

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
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
    </Router>
  );
}

export default App;