const pool = require('../config/db');

exports.getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const conn = await pool.getConnection();
    const comments = await conn.query(
      'SELECT * FROM Comments WHERE product_id = ? ORDER BY dateTime DESC',
      [productId]
    );
    conn.release();
    res.json(comments);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { productId } = req.params;
    const { client_id, score, description } = req.body;
    
    const conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO Comments (product_id, client_id, score, description, dateTime) VALUES (?, ?, ?, ?, NOW())',
      [productId, client_id || 1, score, description]
    );
    conn.release();
    
    res.status(201).json({ 
      message: 'Comentario creado ✅',
      commentId: result.insertId
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};