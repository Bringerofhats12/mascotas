require('dotenv').config();
const { Pool } = require('pg');

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000
};

let pool = null;

function getPool() {
  if (!pool) {
    pool = new Pool(dbConfig);

    pool.on('error', (err) => {
      console.error('❌ Error inesperado en el pool de PostgreSQL:', err.message);
    });

    pool
      .connect()
      .then((client) => {
        console.log(
          `✅ Conectado a PostgreSQL -> ${dbConfig.host}:${dbConfig.port} (BD: ${dbConfig.database})`
        );
        client.release();
      })
      .catch((err) => {
        console.error('❌ Error al conectar a la base de datos:', err.message);
        pool = null;
      });
  }
  return pool;
}

/**
 * Ejecuta una consulta usando el pool compartido.
 * Uso: query('SELECT * FROM "Mascota" WHERE "Id" = $1', [id])
 */
async function query(text, params) {
  const activePool = getPool();
  return activePool.query(text, params);
}

module.exports = { getPool, query, dbConfig };