import React from 'react';
import './Sidebar.css';

const Sidebar = ({ open, onClose, user, onNavigate, onLogout, onAuth }) => {
  return (
    <div className={`sidebar-backdrop${open ? ' open' : ''}`} onClick={onClose}>
      <div className={`sidebar${open ? ' open' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="sidebar-close" onClick={onClose}>×</button>
        <div className="sidebar-header">
          <div className="sidebar-avatar">
            {user ? user.firstName?.[0]?.toUpperCase() || user.username[0]?.toUpperCase() : <span>?</span>}
          </div>
          <div className="sidebar-user-info">
            {user ? (
              <>
                <div className="sidebar-name">{user.firstName ? user.firstName + ' ' + user.lastName : user.username}</div>
                <div className="sidebar-email">{user.email}</div>
              </>
            ) : (
              <div className="sidebar-name">Guest</div>
            )}
          </div>
        </div>
        <nav className="sidebar-nav">
          <button className="sidebar-link" onClick={() => onNavigate('home')}><span role="img" aria-label="home">🏠</span> Home</button>
          <button className="sidebar-link" onClick={() => onNavigate('categories')}><span role="img" aria-label="categories">📦</span> Categories</button>
          <button className="sidebar-link" onClick={() => onNavigate('cart')}><span role="img" aria-label="cart">🛒</span> Cart</button>
          <button className="sidebar-link" onClick={() => onNavigate('orders')}><span role="img" aria-label="orders">📜</span> Order History</button>
          <hr />
          {user ? (
            <button className="sidebar-link" onClick={onLogout}><span role="img" aria-label="logout">🚪</span> Logout</button>
          ) : (
            <button className="sidebar-link" onClick={onAuth}><span role="img" aria-label="login">🔑</span> Login / Register</button>
          )}
        </nav>
        <div className="sidebar-footer">
          <small>ShopGoodwill.com Clone © 2025</small>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
