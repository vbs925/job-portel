const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 30000,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PG Error:', err);
  } else {
    console.log('PG Success:', res.rows);
  }
  pool.end();
});
