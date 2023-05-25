const express = require('express');
const fs = require('fs');
const app = express();
const port = 8080;

app.use(express.json());

app.get('/api/products', (req, res) => {
  const productsData = fs.readFileSync('productos.json', 'utf8');
  const products = JSON.parse(productsData);
  res.json(products);
});

app.get('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const productsData = fs.readFileSync('productos.json', 'utf8');
  const products = JSON.parse(productsData);
  const product = products.find((p) => p.id.toString() === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  const productsData = fs.readFileSync('productos.json', 'utf8');
  const products = JSON.parse(productsData);
  const newProductId = generateUniqueId();
  const productWithId = { id: newProductId, ...newProduct };
  products.push(productWithId);
  fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));
  res.json(productWithId);
});

app.put('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  const productsData = fs.readFileSync('productos.json', 'utf8');
  const products = JSON.parse(productsData);
  const productIndex = products.findIndex((p) => p.id.toString() === productId);
  if (productIndex !== -1) {
    const product = products[productIndex];
    products[productIndex] = { ...product, ...updatedProduct };
    fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));
    res.json(products[productIndex]);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.delete('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const productsData = fs.readFileSync('productos.json', 'utf8');
  const products = JSON.parse(productsData);
  const productIndex = products.findIndex((p) => p.id.toString() === productId);
  if (productIndex !== -1) {
    const deletedProduct = products.splice(productIndex, 1);
    fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));
    res.json(deletedProduct[0]);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.post('/api/carts', (req, res) => {
  const newCart = {
    id: generateUniqueId(),
    products: [],
  };
  fs.writeFileSync('carrito.json', JSON.stringify(newCart, null, 2));
  res.json(newCart);
});

app.get('/api/carts/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cartData = fs.readFileSync('carrito.json', 'utf8');
  const cart = JSON.parse(cartData);
  if (cart.id.toString() === cartId) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

app.post('/api/carts/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const cartData = fs.readFileSync('carrito.json', 'utf8');
  const cart = JSON.parse(cartData);
  const product = { id: productId, quantity: 1 };
  const existingProductIndex = cart.products.findIndex((p) => p.id === productId);
  if (existingProductIndex !== -1) {
    cart.products[existingProductIndex].quantity++;
  } else {
    cart.products.push(product);
  }
  fs.writeFileSync('carrito.json', JSON.stringify(cart, null, 2));
  res.json(cart);
});

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
