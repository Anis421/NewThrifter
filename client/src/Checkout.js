import React, { useState } from 'react';
import './Checkout.css';
import ESewaButton from './eSewaButton';

const Checkout = ({ cartItems, onBack, onSubmit, user }) => {
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Fix: item.price is a number, no need to replace
  const total = cartItems.reduce((acc, item) => acc + parseFloat(item.price), 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setOrderError('');
    // Debug log to inspect values being sent to backend
    console.log({
      user,
      cartItems,
      form,
      total
    });
    // Submit order to backend
    try {
      const res = await fetch('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: cartItems,
          shippingName: form.name,
          shippingEmail: form.email,
          shippingAddress: form.address,
          total: total
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order creation failed');
      setOrderId(data.order.id);
      setOrderCreated(true);
    } catch (err) {
      setOrderError(err.message);
    }
  };

  // Require user to be logged in
  if (!user) {
    return (
      <div className="checkout-modal">
        <div className="checkout-content">
          <button className="close-btn" onClick={onBack}>×</button>
          <h2>Login Required</h2>
          <div style={{color: '#c00', margin: '1.5rem 0'}}>You must be logged in to place an order.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-modal">
      <div className="checkout-content">
        <button className="close-btn" onClick={onBack}>×</button>
        <h2>Checkout</h2>
        <div className="checkout-summary">
          <ul>
            {cartItems.map((item, idx) => (
              <li key={idx}>{item.title} <span>${item.price}</span></li>
            ))}
          </ul>
          <div className="checkout-total">Total: ${total.toFixed(2)}</div>
        </div>
        {orderCreated && !paymentSuccess ? (
          <div style={{marginTop: 24, textAlign: 'center'}}>
            <h3>Order created! Proceed to payment:</h3>
            <ESewaButton total={total} orderId={orderId} onSuccess={() => setPaymentSuccess(true)} />
          </div>
        ) : paymentSuccess ? (
          <div style={{marginTop: 24, textAlign: 'center'}}>
            <h2>Thank you for your order!</h2>
            <p>Order confirmation has been sent to your email.</p>
            <button className="close-btn" onClick={onBack}>Close</button>
          </div>
        ) : (
          <form className="checkout-form" onSubmit={handleSubmit}>
            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required type="email" />
            <textarea name="address" placeholder="Shipping Address" value={form.address} onChange={handleChange} required />
            <button className="submit-btn" type="submit">Place Order</button>
            {orderError && <div className="auth-error">{orderError}</div>}
          </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;
