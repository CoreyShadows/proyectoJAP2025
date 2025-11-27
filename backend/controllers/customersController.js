const pool = require('../config/db');

exports.getCustomers = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const customers = await conn.query('SELECT * FROM Customer');
    conn.release();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();
    const customer = await conn.query('SELECT * FROM Customer WHERE client_id = ?', [id]);
    conn.release();
    res.json(customer[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { client_name, lastname, mail, address } = req.body;
    const conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO Customer (client_name, lastname, mail, address) VALUES (?, ?, ?, ?)',
      [client_name, lastname, mail, address]
    );
    conn.release();
    res.status(201).json({ 
      message: 'Cliente creado ✅',
      clientId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};