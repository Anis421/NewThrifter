import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Test: Login flow
it('allows user to open login modal and see login fields', () => {
  render(<App />);
  const loginBtn = screen.getByRole('button', { name: /login/i });
  fireEvent.click(loginBtn);
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
});

// Test: Add to Cart flow
it('allows user to add item to cart', async () => {
  render(<App />);
  // Wait for products to load
  await waitFor(() => expect(screen.getByText(/featured items/i)).toBeInTheDocument());
  // Find first Add to Cart button
  const items = screen.getAllByRole('img', { name: /men|women|t-shirt|dress|jacket|jeans|coat|blouse/i });
  fireEvent.click(items[0]);
  const addToCartBtn = await screen.findByRole('button', { name: /add to cart/i });
  fireEvent.click(addToCartBtn);
  // Cart badge should update
  const cartBtn = screen.getByRole('button', { name: /cart/i });
  expect(cartBtn).toHaveTextContent(/1/);
});

// Test: Checkout flow
it('shows checkout modal when user clicks checkout in cart', async () => {
  render(<App />);
  // Add item to cart
  await waitFor(() => expect(screen.getByText(/featured items/i)).toBeInTheDocument());
  const items = screen.getAllByRole('img', { name: /men|women|t-shirt|dress|jacket|jeans|coat|blouse/i });
  fireEvent.click(items[0]);
  const addToCartBtn = await screen.findByRole('button', { name: /add to cart/i });
  fireEvent.click(addToCartBtn);
  // Open cart and click checkout
  const cartBtn = screen.getByRole('button', { name: /cart/i });
  fireEvent.click(cartBtn);
  const checkoutBtn = await screen.findByRole('button', { name: /checkout/i });
  fireEvent.click(checkoutBtn);
  // Should see checkout modal
  expect(screen.getByText(/checkout/i)).toBeInTheDocument();
});

// Test: eSewa payment button appears after order creation
it('shows eSewa button after order is created', async () => {
  render(<App />);
  // Add item to cart and open checkout
  await waitFor(() => expect(screen.getByText(/featured items/i)).toBeInTheDocument());
  const items = screen.getAllByRole('img', { name: /men|women|t-shirt|dress|jacket|jeans|coat|blouse/i });
  fireEvent.click(items[0]);
  const addToCartBtn = await screen.findByRole('button', { name: /add to cart/i });
  fireEvent.click(addToCartBtn);
  const cartBtn = screen.getByRole('button', { name: /cart/i });
  fireEvent.click(cartBtn);
  const checkoutBtn = await screen.findByRole('button', { name: /checkout/i });
  fireEvent.click(checkoutBtn);
  // Fill checkout form
  fireEvent.change(screen.getByPlaceholderText(/full name/i), { target: { value: 'Test User' } });
  fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByPlaceholderText(/shipping address/i), { target: { value: 'Kathmandu' } });
  const placeOrderBtn = screen.getByRole('button', { name: /place order/i });
  fireEvent.click(placeOrderBtn);
  // Wait for eSewa button
  await waitFor(() => expect(screen.getByText(/pay with esewa/i)).toBeInTheDocument());
});
