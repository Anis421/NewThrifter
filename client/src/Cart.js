import React from 'react';
import './Cart.css';

const Cart = ({ cartItems, onClose, onRemove, onCheckout }) => {
  // Fix: item.price is a number, no need to replace
  const total = cartItems.reduce((acc, item) => acc + parseFloat(item.price), 0);

  return (
    <div className="cart-modal">
      <div className="cart-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <div className="cart-empty">Your cart is empty.</div>
        ) : (
          <>
            <ul className="cart-list">
              {cartItems.map((item, idx) => (
                <li key={idx} className="cart-item">
                  <img src={item.image || item.img} alt={item.title} className="cart-thumb" />
                  <div className="cart-info">
                    <div className="cart-title">{item.title}</div>
                    <div className="cart-price">${item.price}</div>
                  </div>
                  <button className="remove-btn" onClick={() => onRemove(idx)}>Remove</button>
                </li>
              ))}
            </ul>
            <div className="cart-total">Total: ${total.toFixed(2)}</div>
            <button className="checkout-btn" onClick={onCheckout}>Checkout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
