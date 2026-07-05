const { query } = require('../config/db');

const TABLE = '"Mascota"';

function normalizarRaza(raza) {
  return raza && raza.trim() !== '' ? raza.trim() : 'desconocida';
}

function normalizarEnEstablecimiento(valor) {
  return valor === 'si' ? 'si' : 'no';
}

async function getAll() {
  const result = await query(`SELECT * FROM ${TABLE} ORDER BY "Id" DESC`);
  return result.rows;
}

async function getById(id) {
  const result = await query(`SELECT * FROM ${TABLE} WHERE "Id" = $1`, [id]);
  return result.rows[0];
}

async function create(data) {
  const result = await query(
    `INSERT INTO ${TABLE}
       ("Nombre", "Especie", "Raza", "Dueno", "Direccion", "Numero", "EnEstablecimiento")
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.nombre,
      data.especie,
      normalizarRaza(data.raza),
      data.dueno,
      data.direccion,
      data.numero,
      normalizarEnEstablecimiento(data.enEstablecimiento)
    ]
  );
  return result.rows[0];
}

async function update(id, data) {
  const result = await query(
    `UPDATE ${TABLE}
     SET "Nombre" = $1,
         "Especie" = $2,
         "Raza" = $3,
         "Dueno" = $4,
         "Direccion" = $5,
         "Numero" = $6,
         "EnEstablecimiento" = $7
     WHERE "Id" = $8
     RETURNING *`,
    [
      data.nombre,
      data.especie,
      normalizarRaza(data.raza),
      data.dueno,
      data.direccion,
      data.numero,
      normalizarEnEstablecimiento(data.enEstablecimiento),
      id
    ]
  );
  return result.rows[0];
}

async function remove(id) {
  await query(`DELETE FROM ${TABLE} WHERE "Id" = $1`, [id]);
}

module.exports = { getAll, getById, create, update, remove };