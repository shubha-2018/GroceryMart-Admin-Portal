import React, { useState, useEffect } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import { products as defaultProducts } from './data/mockData';
import api from './services/api';

function App() {
  const getInitialSection = () => {
    try {
      const search = new URLSearchParams(window.location.search);
      const sec = search.get('section');
      if (sec) return sec;

      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (['products', 'offers', 'orders', 'inquiries', 'overview'].includes(path)) {
        return path;
      }
      return 'overview';
    } catch (e) {
      return 'overview';
    }
  };

  const [adminSection, setAdminSectionState] = useState(getInitialSection());
  const [productsList, setProductsList] = useState(defaultProducts);

  const setAdminSection = (section) => {
    setAdminSectionState(section);
    try {
      const url = section && section !== 'overview' ? `/?section=${section}` : '/';
      window.history.pushState({ section }, '', url);
    } catch (err) {}
  };

  useEffect(() => {
    const handleUrlChange = () => {
      setAdminSectionState(getInitialSection());
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Fetch initial products from MySQL Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.products.getAll();
        if (res && res.data && res.data.length > 0) {
          const mapped = res.data.map(p => ({
            ...p,
            category: p.category_name || p.category,
            img: p.image_url || p.img
          }));
          setProductsList(mapped);
        }
      } catch (err) {
        console.warn('Backend unavailable, using default catalog fallback');
      }
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <AdminDashboard 
        setActiveTab={(tab) => {
          if (tab === 'Home' && import.meta.env.VITE_STORE_URL) {
            window.location.href = import.meta.env.VITE_STORE_URL;
          }
        }}
        productsList={productsList} 
        setProductsList={setProductsList} 
        adminSection={adminSection}
        setAdminSection={setAdminSection}
      />
    </div>
  );
}

export default App;
