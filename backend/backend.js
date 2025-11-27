const { connect } = require('http2');
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'ecommerce',
    connectionLimit: 5
});


pool.getConnection()
   .then(conn => {
     console.log("Connected to the database");
     conn.release(); // release to pool
   })
   .catch(err => {
     console.error("Unable to connect to the database:", err);
   });

module.exports = pool;
  