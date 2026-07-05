const { query } = require('../config/db');

const TABLE = '"Usuario"';

async function getByUsername(nombreUsuario) {
  const result = await query(
    `SELECT * FROM ${TABLE} WHERE "NombreUsuario" = $1`,
    [nombreUsuario]
  );
  return result.rows[0];
}

async function create(data) {
  const result = await query(
    `INSERT INTO ${TABLE} ("NombreUsuario", "Nombre", "PasswordHash")
     VALUES ($1, $2, $3)
     RETURNING "Id", "NombreUsuario", "Nombre", "FechaCreacion"`,
    [data.nombreUsuario, data.nombre, data.passwordHash]
  );
  return result.rows[0];
}

module.exports = { getByUsername, create };