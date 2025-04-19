// --- Database Setup (Sequelize/SQLite) ---
const { sequelize, User, Order } = require('./models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

// --- Express Setup ---
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// --- Registration Endpoint (DB version) ---
app.post('/register', async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;
  if (!username || !email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const existingUser = await User.findOne({ where: { [Op.or]: [{ username }, { email }] } });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash, firstName, lastName });
    res.json({ user: { username: user.username, email: user.email, firstName, lastName } });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed.' });
  }
});

// --- Login Endpoint (DB version) ---
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required.' });
  }
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials.' });
    res.json({ user: { username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed.' });
  }
});

// --- Orders Endpoints ---
app.post('/orders', async (req, res) => {
  console.log('Received POST /orders');
  const { userId, items, shippingName, shippingEmail, shippingAddress, total } = req.body;
  if (!userId || !items || !shippingName || !shippingEmail || !shippingAddress || !total) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    console.log('Creating order...');
    const order = await Order.create({
      userId,
      items: JSON.stringify(items),
      shippingName,
      shippingEmail,
      shippingAddress,
      total,
      paymentStatus: 'pending'
    });
    console.log('Order created:', order.id);
    res.json({ order });
  } catch (err) {
    console.error('Order creation failed:', err);
    res.status(500).json({ message: 'Order creation failed.' });
  }
});

app.get('/orders', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: 'Missing userId' });
  try {
    const orders = await Order.findAll({ where: { userId } });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch orders.' });
  }
});

// --- eSewa Payment Success/Fail Endpoints ---
app.get('/esewa/success', async (req, res) => {
  const { orderId } = req.query;
  if (!orderId) return res.status(400).send('Missing orderId');
  try {
    await Order.update({ paymentStatus: 'paid' }, { where: { id: orderId } });
    // Optionally, render a simple HTML confirmation or redirect to frontend
    res.redirect(`/esewa-success?orderId=${orderId}`);
  } catch (err) {
    res.status(500).send('Failed to update order');
  }
});

app.get('/esewa/fail', async (req, res) => {
  const { orderId } = req.query;
  if (!orderId) return res.status(400).send('Missing orderId');
  try {
    await Order.update({ paymentStatus: 'failed' }, { where: { id: orderId } });
    res.redirect(`/esewa-fail?orderId=${orderId}`);
  } catch (err) {
    res.status(500).send('Failed to update order');
  }
});

app.get('/', (req, res) => {
  res.send('ShopGoodwill.com Clone Backend');
});

// --- Debug: Sequelize sync ---
console.log('About to sync sequelize...');
sequelize.sync().then(() => {
  console.log('Sequelize sync complete.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
