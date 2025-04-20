import React, { useState, useEffect } from 'react';
import './App.css';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import Checkout from './Checkout';
import CategorySlider from './CategorySlider';
import Auth from './Auth';
import Sidebar from './Sidebar';
import ESewaSuccess from './ESewaSuccess';
import ESewaFail from './ESewaFail';
import ESewaPaymentButton from './ESewaPaymentButton';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync user state with localStorage
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Fetch products from backend
  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        // Extract unique categories from products
        const cats = [...new Set(data.map(item => item.category))];
        // Ensure clothing categories are always present
        const required = ["men's clothing", "women's clothing"];
        required.forEach(cat => {
          if (!cats.includes(cat)) cats.push(cat);
        });
        setCategories(cats);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    setSelectedProduct(null);
    setCartOpen(true);
  };

  const handleRemoveFromCart = (idx) => {
    setCart(cart.filter((_, i) => i !== idx));
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setCart([]);
    setCheckoutOpen(false);
  };

  const handleAuth = (userObj) => {
    setUser(userObj);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Use categories and products from backend
  const filteredItems = products.filter(item => {
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesSearch = search.trim() === '' ? true : item.title.toLowerCase().includes(search.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Router>
      <Routes>
        <Route path="/esewa-success" element={<ESewaSuccess />} />
        <Route path="/esewa-fail" element={<ESewaFail />} />
        <Route path="/*" element={
          <div className="App">
            <Sidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              user={user}
              onNavigate={(target) => {
                setSidebarOpen(false);
                if (target === 'home') {
                  setSelectedCategory(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (target === 'categories') {
                  document.querySelector('.shop-categories')?.scrollIntoView({ behavior: 'smooth' });
                } else if (target === 'cart') {
                  setCartOpen(true);
                } else if (target === 'orders') {
                  // TODO: Implement order history modal/page
                  alert('Order history coming soon!');
                }
              }}
              onLogout={handleLogout}
              onAuth={() => setAuthOpen(true)}
            />
            <header className="header">
              <div className="nav-bar">
                <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
                <h1 className="logo">The Thrifter</h1>
                <div className="search-bar enhanced-search">
                  <input
                    type="text"
                    placeholder="🔍 Search for products, brands, or categories..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ padding: '0.6rem 1.2rem', borderRadius: '24px', border: '1.5px solid #0090d0', fontSize: '1.08rem', minWidth: 220, outline: 'none', boxShadow: '0 1px 4px rgba(0,144,208,0.06)' }}
                  />
                </div>
                <button className="cart-btn enhanced-cart-btn" onClick={() => setCartOpen(true)}>
                  <span className="cart-icon">🛒</span>
                  {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
                </button>
                {user ? (
                  <>
                    <span className="user-info">Hello, {user.firstName ? user.firstName : user.username}!</span>
                    <button className="auth-btn enhanced-auth-btn logout" onClick={handleLogout}>Logout</button>
                  </>
                ) : (
                  <button className="auth-btn enhanced-auth-btn" onClick={() => setAuthOpen(true)}>
                    <span role="img" aria-label="login">🔑</span> Login / Register
                  </button>
                )}
              </div>
              <div className="banner">
                <div className="banner-img banner-bg"></div>
                <div className="banner-text">
                  <h2>One Stop Solution With The Thrifter</h2>
                </div>
              </div>
            </header>
            <main>
              <div className="shop-categories">
                <h3>SHOP TOP CATEGORIES</h3>
                <CategorySlider 
                  categories={categories} 
                  onSelect={cat => setSelectedCategory(cat)} 
                />
                {selectedCategory && <button className="clear-category" onClick={() => setSelectedCategory(null)}>Clear Filter</button>}
              </div>
              <h2 className="featured-title">FEATURED ITEMS{selectedCategory ? `: ${selectedCategory}` : ''}</h2>
              <div className="featured-grid">
                {filteredItems.map((item, idx) => (
                  <div className="item-card" key={item.id} onClick={() => setSelectedProduct(item)}>
                    <img src={item.image} alt={item.title} className="item-img" />
                    <div className="item-info">
                      <div className="item-title">{item.title}</div>
                      <div className="item-price">${item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
            {selectedProduct && (
              <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} />
            )}
            {cartOpen && (
              <Cart cartItems={cart} onClose={() => setCartOpen(false)} onRemove={handleRemoveFromCart} onCheckout={handleCheckout} />
            )}
            {checkoutOpen && (
              <div>
                <Checkout cartItems={cart} onBack={() => setCheckoutOpen(false)} onSubmit={handleOrderComplete} user={user} />
                <div style={{ margin: '20px 0' }}>
                  <h3>Pay with eSewa (Test)</h3>
                  <ESewaPaymentButton amount={cart.reduce((sum, item) => sum + (item.price || 0), 0)} pid={"ORDER123"} />
                </div>
              </div>
            )}
            {authOpen && (
              <Auth onAuth={handleAuth} onClose={() => setAuthOpen(false)} />
            )}
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
