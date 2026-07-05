/* =========================================================
   Base de datos: Patitas con Amor
   Sistema de gestión de mascotas de la veterinaria
   Motor: PostgreSQL
   =========================================================
   Nota: a diferencia de SQL Server, en PostgreSQL te conectas
   directamente a la base de datos que ya creaste (por ejemplo
   "PatitasConAmor") antes de correr este script; no existe
   "CREATE DATABASE ... GO" dentro del mismo script de tablas.
   Si usas psql:
     createdb PatitasConAmor
     psql -d PatitasConAmor -f script.sql
   ========================================================= */

-- 1) Eliminar las tablas si ya existen (para poder re-ejecutar el script sin errores)
DROP TABLE IF EXISTS "Mascota";
DROP TABLE IF EXISTS "Usuario";

-- 2) Crear la tabla Mascota
CREATE TABLE "Mascota" (
    "Id"                  SERIAL PRIMARY KEY,                         -- No se muestra en el frontend
    "Nombre"              VARCHAR(100) NOT NULL,                      -- Nombre de la mascota
    "Especie"             VARCHAR(50)  NOT NULL,                      -- Perro, gato, ave, etc.
    "Raza"                VARCHAR(50)  NOT NULL DEFAULT 'desconocida', -- Si no se especifica, "desconocida"
    "Dueno"               VARCHAR(100) NOT NULL,                      -- Nombre del propietario
    "Direccion"           VARCHAR(200) NOT NULL,                      -- Dirección de residencia del dueño
    "Numero"              VARCHAR(20)  NOT NULL,                      -- Número de contacto del dueño
    "EnEstablecimiento"   VARCHAR(2)   NOT NULL DEFAULT 'no',         -- 'si' o 'no'
    CONSTRAINT "CK_Mascota_EnEstablecimiento" CHECK ("EnEstablecimiento" IN ('si', 'no'))
);

-- 3) Tabla de usuarios (login / registro)
CREATE TABLE "Usuario" (
    "Id"              SERIAL PRIMARY KEY,
    "NombreUsuario"   VARCHAR(50)  NOT NULL UNIQUE,          -- usado para iniciar sesión
    "Nombre"          VARCHAR(100) NOT NULL,                 -- nombre para mostrar
    "PasswordHash"    VARCHAR(255) NOT NULL,                 -- contraseña hasheada con bcrypt
    "FechaCreacion"   TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- 4) (Opcional) Datos de ejemplo para probar la aplicación
INSERT INTO "Mascota" ("Nombre", "Especie", "Raza", "Dueno", "Direccion", "Numero", "EnEstablecimiento")
VALUES
    ('Firulais', 'Perro', 'Labrador',     'Juan Pérez',   'Av. Los Álamos 123',   '987654321', 'si'),
    ('Michi',    'Gato',  'desconocida',  'María López',  'Calle Las Flores 456', '912345678', 'no'),
    ('Perico',   'Ave',   'Cacatúa',      'Carlos Ruiz',  'Jr. Las Palmeras 789', '955512345', 'no');

-- 5) Verificación rápida
SELECT * FROM "Mascota";
SELECT * FROM "Usuario";