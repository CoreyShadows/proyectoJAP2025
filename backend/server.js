const express = require('express');
const cors = require('cors');
require('dotenv').config();

const verifyToken = require('./middlewares/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

//Rutas publicas (login)
app.use('/', require('./routes/auth'));

app.use(verifyToken); // Middleware para verificar token en rutas protegidas

// Rutas de API
app.use('/api/categories', require('./routes/categories'));
app.use('/api/categories-products', require('./routes/categoriesProducts'));
app.use('/api/products', require('./routes/products'));
app.use('/api/comments', require('./routes/comments'));


app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api`);
  console.log(`\n✅ Endpoints disponibles:`);
  console.log(`   - GET http://localhost:${PORT}/api/categories`);
  console.log(`   - GET http://localhost:${PORT}/api/categories/:id`);
  console.log(`   - GET http://localhost:${PORT}/api/products`);
  console.log(`   - GET http://localhost:${PORT}/api/products/:id`);
  console.log(`   - GET http://localhost:${PORT}/api/products/category/:categoryId`);
  console.log(`   - GET http://localhost:${PORT}/api/comments/:productId\n`);
});