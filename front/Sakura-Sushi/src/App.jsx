import React, { useState, useEffect } from 'react';
import { useCart } from './context/CartContext';
import ProductCard from './components/product/ProductCard';
import useProducts from './hooks/useProducts';
import useOrders from './hooks/useOrders';
import {
  ShoppingCart,
  Star,
  Plus
} from 'lucide-react';
import Header from './components/layouts/Header';
import Navigation from './components/layouts/Navigation';
import Footer from './components/layouts/Footer';
import MenuSection from './components/sections/MenuSection';
import CartSection from './components/sections/CartSection';
import AboutSection from './components/sections/AboutSection';
import ContactSection from './components/sections/ContactSection';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [activeSection, setActiveSection] = useState('menu');
  const [selectedCategoria, setSelectedCategoria] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const { cart, totalItems, clearCart } = useCart();
  const { products, categories, loadInitialData, loadProductsByCategoria, searchProducts, loading, error } = useProducts();
  const { processOrder, loading: orderLoading } = useOrders();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      searchProducts(searchTerm);
    } else if (selectedCategoria === 'Todos') {
      loadInitialData();
    } else {
      loadProductsByCategoria(selectedCategoria);
    }
  }, [selectedCategoria, searchTerm, loadInitialData, loadProductsByCategoria, searchProducts]);

  return (
    <div className="container-fluid bg-light p-0 d-flex flex-column min-vh-100">
      <Header setActiveSection={setActiveSection} totalItems={totalItems} />
      <Navigation setActiveSection={setActiveSection} activeSection={activeSection} totalItems={totalItems} />
      <main className="container my-4 flex-grow-1">
        {activeSection === 'menu' && (
          <MenuSection
            ProductCard={ProductCard}
            products={products}
            categories={categories}
            loading={loading}
            error={error}
            selectedCategoria={selectedCategoria}
            onCategoriaChange={setSelectedCategoria}
            searchTerm={searchTerm}
            handleSearchChange={setSearchTerm}
            Star={Star}
            Plus={Plus}
          />
        )}
        {activeSection === 'cart' && (
          <CartSection
            cart={cart}
            processOrder={processOrder}
            orderLoading={orderLoading}
            clearCart={clearCart}
            setActiveSection={setActiveSection}
          />
        )}
        {activeSection === 'about' && <AboutSection />}
        {activeSection === 'contact' && <ContactSection />}
      </main>
      <Footer />
    </div>
  );
};

export default App;