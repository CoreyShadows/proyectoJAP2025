const pool = require('../config/db');

exports.getCategories = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const categories = await conn.query('SELECT * FROM Category');
    conn.release();
    res.json(categories);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();
    const category = await conn.query('SELECT * FROM Category WHERE category_id = ?', [id]);
    conn.release();
    res.json(category[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};