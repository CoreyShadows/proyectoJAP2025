const pool = require('../config/db');

exports.getProducts = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const products = await conn.query('SELECT * FROM Products');
    conn.release();
    res.json(products);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();
    const product = await conn.query('SELECT * FROM Products WHERE product_id = ?', [id]);
    conn.release();
    
    if (!product[0]) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(product[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const conn = await pool.getConnection();
    const products = await conn.query('SELECT * FROM Products WHERE category_id = ?', [categoryId]);
    conn.release();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};