import React, { useState, useEffect } from 'react';
import './App.css';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import Checkout from './Checkout';
import Categories from './Categories';
import Auth from './Auth';
import Sidebar from './Sidebar';
import ESewaSuccess from './ESewaSuccess';
import ESewaFail from './ESewaFail';
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

  // Fetch categories and products from Fake Store API
  useEffect(() => {
    fetch('https://fakestoreapi.com/products/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => setProducts(data));
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
                <h1 className="logo">SHOPGOODWILL<span>.com</span></h1>
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <button className="cart-btn" onClick={() => setCartOpen(true)}>
                  🛒
                  {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
                </button>
                {user ? (
                  <>
                    <span className="user-info">Hello, {user.firstName ? user.firstName : user.username}!</span>
                    <button className="auth-btn" onClick={handleLogout}>Logout</button>
                  </>
                ) : (
                  <button className="auth-btn" onClick={() => setAuthOpen(true)}>Login / Register</button>
                )}
              </div>
              <div className="banner">
                <div className="banner-img"></div>
                <div className="banner-text">
                  <h2>#create opportunity</h2>
                  <p>with SHOPGOODWILL.com</p>
                  <button className="learn-more">LEARN MORE</button>
                </div>
              </div>
            </header>
            <main>
              <div className="shop-categories">
                <h3>SHOP TOP CATEGORIES</h3>
                <Categories 
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
              <Checkout cartItems={cart} onBack={() => setCheckoutOpen(false)} onSubmit={handleOrderComplete} user={user} />
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
