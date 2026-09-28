import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Truck, 
  AlertCircle,
  X,
  RefreshCw,
  ExternalLink,
  SlidersHorizontal,
  Mail,
  ArrowUpRight,
  ShieldCheck,
  Tag,
  Sparkles,
  UploadCloud,
  LogOut,
  UserCheck
} from 'lucide-react';
import { products as defaultProducts, categories as defaultCategories } from '../data/mockData';
import ImageUploadField from '../components/common/ImageUploadField';
import AdminLoginForm from '../components/admin/AdminLoginForm';
import api from '../services/api';

const initialOffersList = [
  {
    id: 1,
    title: 'Weekend Special',
    subtitle: 'UP TO',
    discount: '30% OFF',
    coupon_code: 'WEEKEND30',
    image_url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80',
    bg_class: 'offer-green',
    link_tab: 'Offers'
  },
  {
    id: 2,
    title: 'Combo Deals',
    subtitle: 'UP TO',
    discount: '40% OFF',
    coupon_code: 'COMBO40',
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80',
    bg_class: 'offer-red',
    link_tab: 'Combo Deals'
  },
  {
    id: 3,
    title: 'Daily Essentials',
    subtitle: 'UP TO',
    discount: '25% OFF',
    coupon_code: 'DAILY25',
    image_url: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&q=80',
    bg_class: 'offer-yellow',
    link_tab: 'Shop'
  },
  {
    id: 4,
    title: 'New Arrivals',
    subtitle: 'UP TO',
    discount: '20% OFF',
    coupon_code: 'NEW20',
    image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80',
    bg_class: 'offer-blue',
    link_tab: 'New Arrivals'
  }
];

const initialOrdersList = [
  {
    id: 'GM-98231',
    customer_name: 'Rahul Sharma',
    customer_email: 'rahul.s@example.com',
    customer_phone: '+91 98765 43210',
    delivery_address: 'Flat 402, Green Valley Apts, Mumbai',
    date: 'Today, 11:42 PM',
    order_status: 'Out for Delivery',
    status_color: '#ff9800',
    total_amount: '₹349.00',
    payment_method: 'Cash on Delivery',
    payment_status: 'Pending',
    items: [
      { name: 'Fresh Tomato', qty: '1 kg', price: '₹24.00', quantity: 1 },
      { name: 'Amul Fresh Milk', qty: '1 L', price: '₹61.00', quantity: 2 },
      { name: 'Aashirvaad Shudh Chakki Atta', qty: '5 kg', price: '₹235.00', quantity: 1 }
    ]
  },
  {
    id: 'GM-94102',
    customer_name: 'Priya Patel',
    customer_email: 'priya.patel@example.com',
    customer_phone: '+91 98220 11223',
    delivery_address: 'B-12, Sunrise Residency, Pune',
    date: 'Yesterday, 4:15 PM',
    order_status: 'Delivered',
    status_color: '#2e7d32',
    total_amount: '₹475.00',
    payment_method: 'UPI / Online',
    payment_status: 'Paid',
    items: [
      { name: 'Farm Fresh Paneer', qty: '200g', price: '₹85.00', quantity: 1 },
      { name: 'Pedigree Adult Dog Food', qty: '1.2 kg', price: '₹340.00', quantity: 1 },
      { name: 'Coca Cola Chilled', qty: '750 ml', price: '₹40.00', quantity: 1 }
    ]
  },
  {
    id: 'GM-88204',
    customer_name: 'Amit Verma',
    customer_email: 'amit.v@example.com',
    customer_phone: '+91 97110 55443',
    delivery_address: '104 Silver Palms, Bangalore',
    date: '28 Aug, 2:30 PM',
    order_status: 'Delivered',
    status_color: '#2e7d32',
    total_amount: '₹325.00',
    payment_method: 'Credit Card',
    payment_status: 'Paid',
    items: [
      { name: 'Surf Excel Matic Detergent', qty: '1 kg', price: '₹220.00', quantity: 1 },
      { name: 'Vim Dishwash Liquid Gel', qty: '500 ml', price: '₹105.00', quantity: 1 }
    ]
  }
];

const AdminDashboard = ({ 
  setActiveTab, 
  productsList = defaultProducts, 
  setProductsList, 
  adminSection = 'overview', 
  setAdminSection 
}) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const local = localStorage.getItem('grocery_mart_admin_user');
      if (local) return JSON.parse(local);
      const session = sessionStorage.getItem('grocery_mart_admin_user');
      if (session) return JSON.parse(session);
      return null;
    } catch (e) {
      return null;
    }
  });

  const handleAdminLogout = () => {
    try {
      localStorage.removeItem('grocery_mart_admin_user');
      localStorage.removeItem('grocery_mart_admin_token');
      sessionStorage.removeItem('grocery_mart_admin_user');
    } catch (e) {}
    setAdminUser(null);
  };

  const [activeAdminSection, setActiveAdminSection] = useState(adminSection || 'overview');

  useEffect(() => {
    if (adminSection) {
      setActiveAdminSection(adminSection);
    }
  }, [adminSection]);

  const handleSectionSwitch = (sec) => {
    setActiveAdminSection(sec);
    if (setAdminSection) setAdminSection(sec);
  };

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('grocery_mart_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return productsList || defaultProducts;
  });

  const [offers, setOffers] = useState(() => {
    try {
      const saved = localStorage.getItem('grocery_mart_offers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialOffersList;
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('grocery_mart_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialOrdersList;
  });

  // Sync state if localStorage changes in other tabs
  useEffect(() => {
    const handleStorageSync = () => {
      try {
        const savedProducts = localStorage.getItem('grocery_mart_products');
        if (savedProducts) {
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
        }
        const savedOffers = localStorage.getItem('grocery_mart_offers');
        if (savedOffers) {
          const parsed = JSON.parse(savedOffers);
          if (Array.isArray(parsed) && parsed.length > 0) setOffers(parsed);
        }
        const savedOrders = localStorage.getItem('grocery_mart_orders');
        if (savedOrders) {
          const parsed = JSON.parse(savedOrders);
          if (Array.isArray(parsed) && parsed.length > 0) setOrders(parsed);
        }
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorageSync);
    window.addEventListener('grocery_mart_data_updated', handleStorageSync);
    return () => {
      window.removeEventListener('storage', handleStorageSync);
      window.removeEventListener('grocery_mart_data_updated', handleStorageSync);
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [backendOnline, setBackendOnline] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal State for Product Add / Edit
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Fruits & Vegetables',
    qty: '1 kg',
    price: '₹',
    img: '',
    is_deal: false,
    is_popular: true,
    stock: 50
  });

  // Modal State for Offer Add / Edit
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [offerFormData, setOfferFormData] = useState({
    title: '',
    subtitle: 'UP TO',
    discount: '30% OFF',
    coupon_code: '',
    image_url: '',
    bg_class: 'offer-green',
    link_tab: 'Offers'
  });

  // Check Backend Connectivity & Load Data
  useEffect(() => {
    const testBackend = async () => {
      try {
        const health = await api.checkHealth();
        if (health && health.status === 'online') {
          setBackendOnline(true);
          
          // Fetch products from MySQL
          const pRes = await api.products.getAll();
          if (pRes && pRes.data && pRes.data.length > 0) {
            const mapped = pRes.data.map(p => ({
              ...p,
              category: p.category_name || p.category,
              img: p.image_url || p.img
            }));
            setProducts(mapped);
            if (setProductsList) setProductsList(mapped);
            try {
              localStorage.setItem('grocery_mart_products', JSON.stringify(mapped));
            } catch (e) {}
          }

          // Fetch offers from MySQL
          const oRes = await api.offers.getAll();
          if (oRes && oRes.data && oRes.data.length > 0) {
            setOffers(oRes.data);
            try {
              localStorage.setItem('grocery_mart_offers', JSON.stringify(oRes.data));
            } catch (e) {}
          }
        }
      } catch (e) {
        setBackendOnline(false);
      }
    };
    testBackend();
  }, [setProductsList]);

  // Sync products if productsList prop updates
  useEffect(() => {
    if (productsList && productsList.length > 0) {
      setProducts(productsList);
    }
  }, [productsList]);

  // Handle open Add Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Fruits & Vegetables',
      qty: '1 kg',
      price: '₹50.00',
      img: '',
      is_deal: false,
      is_popular: true,
      stock: 50
    });
    setShowProductModal(true);
  };

  // Handle open Edit Modal
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || 'Fruits & Vegetables',
      qty: product.qty || '1 unit',
      price: product.price || '₹0.00',
      img: product.img || product.image_url || '',
      is_deal: !!product.is_deal,
      is_popular: !!product.is_popular,
      stock: product.stock || 50
    });
    setShowProductModal(true);
  };

  // Save Product (Create or Update to MySQL Backend & Storefront)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.img) {
      alert('Please fill out all required fields (Name, Price, and Image).');
      return;
    }

    try {
      setLoading(true);

      const productPayload = {
        name: formData.name,
        category_name: formData.category,
        category: formData.category,
        qty: formData.qty,
        price: formData.price,
        image_url: formData.img,
        img: formData.img,
        is_deal: formData.is_deal ? 1 : 0,
        is_popular: formData.is_popular ? 1 : 0,
        stock: formData.stock || 100
      };

      if (editingProduct) {
        // --- 1. EDIT EXISTING PRODUCT ---
        let savedData = {
          ...editingProduct,
          ...formData,
          category_name: formData.category,
          category: formData.category,
          image_url: formData.img,
          img: formData.img
        };

        if (editingProduct.id) {
          try {
            const res = await api.products.update(editingProduct.id, productPayload);
            if (res && res.data) {
              savedData = {
                ...res.data,
                category: res.data.category_name || res.data.category,
                img: res.data.image_url || res.data.img || formData.img,
                image_url: res.data.image_url || res.data.img || formData.img
              };
            }
          } catch (apiErr) {
            console.warn('Backend update error, updating locally:', apiErr);
          }
        }

        const updatedList = products.map(p => {
          if (editingProduct.id && p.id === editingProduct.id) return savedData;
          if (editingProduct.name && p.name === editingProduct.name) return savedData;
          return p;
        });

        setProducts(updatedList);
        if (setProductsList) setProductsList(updatedList);
        try {
          localStorage.setItem('grocery_mart_products', JSON.stringify(updatedList));
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('grocery_mart_data_updated'));
        } catch (e) {}
        alert(`✅ Product "${formData.name}" image and details updated successfully!`);
      } else {
        // --- 2. ADD NEW PRODUCT ---
        let savedData = {
          ...formData,
          id: Date.now(),
          category_name: formData.category,
          category: formData.category,
          img: formData.img,
          image_url: formData.img
        };

        try {
          const res = await api.products.create(productPayload);
          if (res && res.data) {
            savedData = {
              ...res.data,
              category: res.data.category_name || res.data.category,
              img: res.data.image_url || res.data.img || formData.img,
              image_url: res.data.image_url || res.data.img || formData.img
            };
          }
        } catch (apiErr) {
          console.warn('Backend create error, adding locally:', apiErr);
        }

        const updatedList = [savedData, ...products];
        setProducts(updatedList);
        if (setProductsList) setProductsList(updatedList);
        try {
          localStorage.setItem('grocery_mart_products', JSON.stringify(updatedList));
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('grocery_mart_data_updated'));
        } catch (e) {}
        alert(`✅ Product "${formData.name}" added successfully!`);
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error saving product: ' + err.message);
    } finally {
      setLoading(false);
      setShowProductModal(false);
      setEditingProduct(null);
    }
  };

  // Delete Product from Database and State
  const handleDeleteProduct = async (product) => {
    const productName = typeof product === 'string' ? product : product.name;
    const productId = typeof product === 'object' ? product.id : null;

    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        if (productId) {
          await api.products.delete(productId);
        }
      } catch (err) {
        console.warn('Error deleting on backend:', err);
      }
      const filtered = products.filter(p => p.name !== productName && p.id !== productId);
      setProducts(filtered);
      if (setProductsList) setProductsList(filtered);
      try {
        localStorage.setItem('grocery_mart_products', JSON.stringify(filtered));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('grocery_mart_data_updated'));
      } catch (e) {}
      alert(`🗑️ Product "${productName}" deleted.`);
    }
  };

  // Open Add Offer Modal
  const handleOpenAddOfferModal = () => {
    setEditingOffer(null);
    setOfferFormData({
      title: 'Mega Savings Deal',
      subtitle: 'UP TO',
      discount: '35% OFF',
      coupon_code: 'MEGA35',
      image_url: '',
      bg_class: 'offer-green',
      link_tab: 'Offers'
    });
    setShowOfferModal(true);
  };

  // Open Edit Offer Modal
  const handleOpenEditOfferModal = (offer) => {
    setEditingOffer(offer);
    setOfferFormData({
      title: offer.title || '',
      subtitle: offer.subtitle || 'UP TO',
      discount: offer.discount || '30% OFF',
      coupon_code: offer.coupon_code || '',
      image_url: offer.image_url || offer.img || '',
      bg_class: offer.bg_class || 'offer-green',
      link_tab: offer.link_tab || 'Offers'
    });
    setShowOfferModal(true);
  };

  // Save Offer (Create or Update to MySQL Backend)
  const handleSaveOffer = async (e) => {
    e.preventDefault();
    if (!offerFormData.title || !offerFormData.discount || !offerFormData.image_url) {
      alert('Please fill in Title, Discount, and upload an Image.');
      return;
    }

    try {
      setLoading(true);
      if (editingOffer && editingOffer.id) {
        const res = await api.offers.update(editingOffer.id, offerFormData);
        const savedData = res?.data || { ...editingOffer, ...offerFormData };
        const updated = offers.map(o => o.id === editingOffer.id ? savedData : o);
        setOffers(updated);
        try {
          localStorage.setItem('grocery_mart_offers', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('grocery_mart_data_updated'));
        } catch (e) {}
        alert(`✅ Offer "${offerFormData.title}" updated successfully!`);
      } else {
        const res = await api.offers.create(offerFormData);
        const savedData = res?.data || { ...offerFormData, id: Date.now() };
        const updated = [savedData, ...offers];
        setOffers(updated);
        try {
          localStorage.setItem('grocery_mart_offers', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('grocery_mart_data_updated'));
        } catch (e) {}
        alert(`✅ Offer "${offerFormData.title}" created successfully!`);
      }
    } catch (err) {
      console.warn('Backend offer save note:', err);
      const fallbackItem = { ...offerFormData, id: editingOffer?.id || Date.now() };
      const updated = editingOffer ? offers.map(o => o.id === editingOffer.id ? fallbackItem : o) : [fallbackItem, ...offers];
      setOffers(updated);
      try {
        localStorage.setItem('grocery_mart_offers', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('grocery_mart_data_updated'));
      } catch (e) {}
      alert(`✅ Offer "${offerFormData.title}" saved!`);
    } finally {
      setLoading(false);
      setShowOfferModal(false);
    }
  };

  // Delete Offer
  const handleDeleteOffer = async (offer) => {
    const offerTitle = offer.title || 'Offer';
    if (window.confirm(`Are you sure you want to delete offer "${offerTitle}"?`)) {
      try {
        if (offer.id) {
          await api.offers.delete(offer.id);
        }
      } catch (err) {
        console.warn('Error deleting offer:', err);
      }
      const updated = offers.filter(o => o.id !== offer.id);
      setOffers(updated);
      try {
        localStorage.setItem('grocery_mart_offers', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('grocery_mart_data_updated'));
      } catch (e) {}
      alert(`🗑️ Offer "${offerTitle}" deleted.`);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    let newColor = '#ff9800';
    if (newStatus === 'Delivered') newColor = '#2e7d32';
    if (newStatus === 'Cancelled') newColor = '#d32f2f';
    if (newStatus === 'Processing') newColor = '#1976d2';

    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, order_status: newStatus, status_color: newColor } : o);
      try {
        localStorage.setItem('grocery_mart_orders', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('grocery_mart_data_updated'));
      } catch (e) {}
      return updated;
    });
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter === 'All') return true;
    return o.order_status === orderStatusFilter;
  });

  // Metrics calculation
  const totalRevenue = orders.reduce((acc, curr) => {
    const num = parseFloat(curr.total_amount.replace(/[^0-9.]/g, '')) || 0;
    return acc + num;
  }, 0);

  // If unauthenticated, render the secure Admin Login Form
  if (!adminUser) {
    return (
      <AdminLoginForm 
        onLoginSuccess={(user) => setAdminUser(user)}
        onBackToStore={() => {
          if (import.meta.env.VITE_STORE_URL) {
            window.location.href = import.meta.env.VITE_STORE_URL;
          } else if (setActiveTab) {
            setActiveTab('Home');
          }
        }}
      />
    );
  }

  return (
    <div style={{ background: '#f4f7f6', minHeight: '100vh', padding: '24px 4% 80px' }}>
      {/* Top Admin Header Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '20px 24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '24px',
        border: '1px solid #e8ede7'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10843e 0%, #0c6830 100%)',
            color: '#fff',
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 132, 62, 0.25)'
          }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>
              GroceryMart Admin Portal
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Admin User Status Badge */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '8px 14px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserCheck size={14} />
            </div>
            <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
              <span style={{ fontSize: '10px', color: '#64748b', display: 'block', fontWeight: '600' }}>Admin Logged In</span>
              <strong style={{ fontSize: '12px', color: '#0f172a' }}>{adminUser?.email || 'admin@grocerymart.com'}</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            style={{
              background: 'var(--primary-color, #10843e)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(16, 132, 62, 0.2)'
            }}
          >
            <Plus size={16} /> Add Product
          </button>

          <button
            type="button"
            onClick={handleAdminLogout}
            style={{
              background: '#fee2e2',
              color: '#b91c1c',
              border: '1px solid #fca5a5',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Logout from Admin"
          >
            <LogOut size={15} /> Logout
          </button>
          
          <button
            type="button"
            onClick={() => {
              if (import.meta.env.VITE_STORE_URL) {
                window.location.href = import.meta.env.VITE_STORE_URL;
              } else if (setActiveTab) {
                setActiveTab('Home');
              }
            }}
            style={{
              background: '#f0f5ee',
              color: '#10843e',
              border: '1px solid #c9e2c6',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ExternalLink size={15} /> Store
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '24px',
        borderBottom: '1px solid #e0e6df',
        paddingBottom: '12px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard },
          { id: 'products', label: `Products Inventory (${products.length})`, icon: Package },
          { id: 'offers', label: `Best Offers & Deals (${offers.length})`, icon: Tag },
          { id: 'orders', label: `Customer Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'inquiries', label: 'Support Inquiries (3)', icon: Mail }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSectionSwitch(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: isActive ? '#10843e' : '#ffffff',
                color: isActive ? '#ffffff' : '#4a5568',
                boxShadow: isActive ? '0 4px 14px rgba(16, 132, 62, 0.25)' : '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SECTION 1: OVERVIEW & METRICS */}
      {activeAdminSection === 'overview' && (
        <div>
          {/* 4 Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #e8ede7', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Total Revenue</span>
                <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '6px', borderRadius: '8px' }}><DollarSign size={18} /></div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a1a' }}>₹{totalRevenue.toFixed(2)}</div>
              <div style={{ fontSize: '12px', color: '#2e7d32', fontWeight: '600', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={13} /> +18.4% from last week
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #e8ede7', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Active Orders</span>
                <div style={{ background: '#fff3e0', color: '#e65100', padding: '6px', borderRadius: '8px' }}><ShoppingBag size={18} /></div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a1a' }}>{orders.length} Orders</div>
              <div style={{ fontSize: '12px', color: '#ff9800', fontWeight: '600', marginTop: '6px' }}>
                1 Out for delivery, 2 Completed
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #e8ede7', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Catalog Inventory</span>
                <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '6px', borderRadius: '8px' }}><Package size={18} /></div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a1a' }}>{products.length} Items</div>
              <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: '600', marginTop: '6px' }}>
                Across 8 Categories
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #e8ede7', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Active Deals</span>
                <div style={{ background: '#fdf2f8', color: '#db2777', padding: '6px', borderRadius: '8px' }}><Sparkles size={18} /></div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a1a' }}>{offers.length} Offers</div>
              <div style={{ fontSize: '12px', color: '#db2777', fontWeight: '600', marginTop: '6px' }}>
                Displayed on Homepage
              </div>
            </div>
          </div>

          {/* Quick Category Summary Grid */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e8ede7', marginBottom: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1a1a1a', marginBottom: '16px' }}>
              Categories Breakdown
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              {defaultCategories.map((c, i) => {
                const count = products.filter(p => p.category === c.name).length;
                return (
                  <div key={i} style={{ background: '#f8faf8', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e5ebe4' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#2d3748' }}>{c.name}</div>
                    <div style={{ fontSize: '12px', color: '#10843e', fontWeight: '600', marginTop: '4px' }}>{count} Products</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PRODUCTS MANAGER */}
      {activeAdminSection === 'products' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e8ede7', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          {/* Filter Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flex: '1 1 300px' }}>
              <div style={{ position: 'relative', flex: '1 1 200px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 36px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Categories ({products.length})</option>
                {defaultCategories.map((c, i) => (
                  <option key={i} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleOpenAddModal}
              style={{
                background: '#10843e',
                color: '#fff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={16} /> Add Product
            </button>
          </div>

          {/* Products Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8faf8', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 14px' }}>Product</th>
                  <th style={{ padding: '12px 14px' }}>Category</th>
                  <th style={{ padding: '12px 14px' }}>Unit / Qty</th>
                  <th style={{ padding: '12px 14px' }}>Price</th>
                  <th style={{ padding: '12px 14px' }}>Badges</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={p.img || p.image_url} 
                        alt={p.name} 
                        style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '8px', background: '#f9f9f9', border: '1px solid #eee' }} 
                      />
                      <span style={{ fontWeight: '700', color: '#1e293b' }}>{p.name}</span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>{p.category}</td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>{p.qty}</td>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#10843e' }}>{p.price}</td>
                    <td style={{ padding: '12px 14px' }}>
                      {p.is_deal && <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', marginRight: '4px' }}>Deal</span>}
                      {p.is_popular && <span style={{ background: '#fef3c7', color: '#d97706', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px' }}>Popular</span>}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(p)}
                          style={{ background: '#f1f5f9', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: '#0284c7' }}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p)}
                          style={{ background: '#fee2e2', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: '#dc2626' }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION: OFFERS & DEALS MANAGER (BEST OFFERS FOR YOU) */}
      {activeAdminSection === 'offers' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e8ede7', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 4px' }}>
                "Best Offers for You" Banners
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Manage promotional banners and upload direct images from your computer
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddOfferModal}
              style={{
                background: '#10843e',
                color: '#fff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={16} /> Add Offer Banner
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {offers.map((offer, i) => (
              <div
                key={offer.id || i}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '18px',
                  background: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                  <img
                    src={offer.image_url || offer.img}
                    alt={offer.title}
                    style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff' }}
                  />
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#10843e', textTransform: 'uppercase' }}>
                      {offer.subtitle || 'UP TO'}
                    </span>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', margin: '2px 0 4px', color: '#1e293b' }}>
                      {offer.title}
                    </h4>
                    <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '12px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px' }}>
                      {offer.discount}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '10px', fontSize: '12px', color: '#64748b' }}>
                  <span>Theme: <strong>{offer.bg_class || 'offer-green'}</strong></span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEditOfferModal(offer)}
                      style={{ background: '#e0f2fe', border: 'none', padding: '6px 10px', borderRadius: '6px', color: '#0284c7', cursor: 'pointer' }}
                      title="Edit Offer"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteOffer(offer)}
                      style={{ background: '#fee2e2', border: 'none', padding: '6px 10px', borderRadius: '6px', color: '#dc2626', cursor: 'pointer' }}
                      title="Delete Offer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: ORDERS MANAGER */}
      {activeAdminSection === 'orders' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e8ede7', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          {/* Status Filter */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {['All', 'Order Placed', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setOrderStatusFilter(status)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: orderStatusFilter === status ? '1px solid #10843e' : '1px solid #e2e8f0',
                  background: orderStatusFilter === status ? '#e8f5e9' : '#fff',
                  color: orderStatusFilter === status ? '#10843e' : '#475569',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {status}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  background: '#fcfdfc'
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #edf2f7', paddingBottom: '12px', marginBottom: '12px', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>Order #{order.id}</span>
                    <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '12px' }}>{order.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#10843e' }}>{order.total_amount}</span>
                    <select
                      value={order.order_status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        border: '1px solid #cbd5e1',
                        background: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
                  <div><strong>Customer:</strong> {order.customer_name} ({order.customer_phone})</div>
                  <div><strong>Address:</strong> {order.delivery_address}</div>
                  <div><strong>Payment:</strong> {order.payment_method} ({order.payment_status})</div>
                </div>

                <div style={{ background: '#fff', borderRadius: '8px', padding: '10px 14px', border: '1px solid #edf2f7' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>Items ({order.items.length}):</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                        <span>• {item.name} ({item.qty}) x {item.quantity}</span>
                        <span style={{ fontWeight: '600' }}>{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: INQUIRIES */}
      {activeAdminSection === 'inquiries' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e8ede7', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Customer Support Messages</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { name: 'Suresh Raina', email: 'suresh@gmail.com', subject: 'Express Delivery in 10 mins', message: 'Is 10-minute delivery available in Bandra West location?', time: 'Today, 10:15 AM' },
              { name: 'Ananya Roy', email: 'ananya.r@yahoo.com', subject: 'Organic Vegetables query', message: 'Do you provide pesticide-free farm fresh leafy greens?', time: 'Yesterday, 3:40 PM' },
              { name: 'Deepak Joshi', email: 'deepak.j@hotmail.com', subject: 'Bulk order discount', message: 'Looking for bulk purchase of Basmati Rice for catering event.', time: '29 Aug, 1:20 PM' }
            ].map((msg, i) => (
              <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#f8faf8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong>{msg.name} ({msg.email})</strong>
                  <span style={{ fontSize: '12px', color: '#888' }}>{msg.time}</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#10843e', marginBottom: '4px' }}>Subject: {msg.subject}</div>
                <div style={{ fontSize: '13px', color: '#475569' }}>{msg.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCT ADD / EDIT MODAL */}
      {showProductModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }} onClick={() => setShowProductModal(false)}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '28px',
            maxWidth: '520px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
          }} onClick={e => e.stopPropagation()}>
            <button 
              type="button"
              onClick={() => setShowProductModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#64748b'
              }}
            >&times;</button>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                {editingProduct ? 'Update product details and price.' : 'Add a new grocery item to your catalog.'}
              </p>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Product Name *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Organic Red Apples" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Category *
                  </label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', background: '#fff', outline: 'none', cursor: 'pointer' }}
                  >
                    {defaultCategories.map((c, i) => (
                      <option key={i} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Unit / Quantity *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 1 kg, 500g, 1 L" 
                    value={formData.qty}
                    onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Price *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. ₹45.00" 
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Stock Available
                  </label>
                  <input 
                    type="number" 
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              {/* DIRECT IMAGE UPLOAD FOR PRODUCT */}
              <ImageUploadField 
                label="Product Image (Upload from Computer)"
                value={formData.img}
                onChange={(uploadedUrl) => setFormData({ ...formData, img: uploadedUrl })}
                required={true}
              />

              <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.is_popular}
                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                    style={{ accentColor: '#10843e', cursor: 'pointer' }}
                  />
                  <span>Mark as Popular</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.is_deal}
                    onChange={(e) => setFormData({ ...formData, is_deal: e.target.checked })}
                    style={{ accentColor: '#10843e', cursor: 'pointer' }}
                  />
                  <span>Deal of the Day</span>
                </label>
              </div>

              <button 
                type="submit" 
                style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '13px',
                  background: '#10843e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 132, 62, 0.25)'
                }}
              >
                {editingProduct ? 'Update Product' : 'Add to Catalog'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OFFER ADD / EDIT MODAL */}
      {showOfferModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }} onClick={() => setShowOfferModal(false)}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '28px',
            maxWidth: '520px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
          }} onClick={e => e.stopPropagation()}>
            <button 
              type="button"
              onClick={() => setShowOfferModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#64748b'
              }}
            >&times;</button>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                {editingOffer ? 'Edit Offer Banner' : 'Create New Offer Banner'}
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                {editingOffer ? 'Update offer banner details.' : 'Add a promotional banner to "Best Offers for You".'}
              </p>
            </div>

            <form onSubmit={handleSaveOffer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Offer Title *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Weekend Special or Summer Blast" 
                  value={offerFormData.title}
                  onChange={(e) => setOfferFormData({ ...offerFormData, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Subtitle / Tag
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. UP TO or FLAT" 
                    value={offerFormData.subtitle}
                    onChange={(e) => setOfferFormData({ ...offerFormData, subtitle: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Discount *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 30% OFF" 
                    value={offerFormData.discount}
                    onChange={(e) => setOfferFormData({ ...offerFormData, discount: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Coupon Code (Optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. SAVE30" 
                    value={offerFormData.coupon_code}
                    onChange={(e) => setOfferFormData({ ...offerFormData, coupon_code: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Card Color Theme
                  </label>
                  <select
                    value={offerFormData.bg_class}
                    onChange={(e) => setOfferFormData({ ...offerFormData, bg_class: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', background: '#fff', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="offer-green">Green Theme</option>
                    <option value="offer-red">Red Theme</option>
                    <option value="offer-yellow">Yellow Theme</option>
                    <option value="offer-blue">Blue Theme</option>
                  </select>
                </div>
              </div>

              {/* DIRECT IMAGE UPLOAD FOR OFFER BANNER */}
              <ImageUploadField 
                label="Offer Image (Upload Direct Image from Computer)"
                value={offerFormData.image_url}
                onChange={(uploadedUrl) => setOfferFormData({ ...offerFormData, image_url: uploadedUrl })}
                required={true}
              />

              <button 
                type="submit" 
                style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '13px',
                  background: '#10843e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 132, 62, 0.25)'
                }}
              >
                {editingOffer ? 'Update Offer Banner' : 'Publish Offer Banner'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
