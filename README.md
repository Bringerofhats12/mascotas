# 🐾 Patitas con Amor

Aplicación web CRUD para la gestión de mascotas registradas en la veterinaria
**"Patitas con Amor"**. Construida en Node.js + Express, con vistas EJS y
base de datos en Microsoft SQL Server.

## Estructura del proyecto

```
patitas-con-amor/
├── database/
│   └── script.sql          # Script para crear la BD y tabla en SQL Server
├── public/
│   └── css/style.css       # Estilos de la aplicación
├── src/
│   ├── config/
│   │   └── db.js           # Conexión dinámica a SQL Server (vía .env)
│   ├── controllers/
│   │   └── mascotaController.js
│   ├── models/
│   │   └── mascotaModel.js # Consultas SQL (CRUD)
│   ├── routes/
│   │   └── mascotaRoutes.js
│   └── app.js               # Configuración de Express
├── views/
│   ├── layout.ejs
│   ├── index.ejs            # Listado
│   ├── create.ejs           # Formulario de creación
│   ├── edit.ejs              # Formulario de edición
│   └── 404.ejs
├── .env.example
├── package.json
└── server.js
```

## 1) Preparar la base de datos

1. Abre **SQL Server Management Studio** (o `sqlcmd`) conectado al servidor
   donde quieras alojar la base de datos.
2. Ejecuta el script `database/script.sql`. Esto creará:
   - La base de datos `PatitasConAmor` (si no existe).
   - La tabla `dbo.Mascota` con las siguientes columnas:

     | Columna             | Tipo         | Notas                                          |
     |---------------------|--------------|-------------------------------------------------|
     | Id                  | INT IDENTITY | Clave primaria, no se muestra en el frontend    |
     | Nombre              | VARCHAR(100) | Nombre de la mascota                            |
     | Especie             | VARCHAR(50)  | Perro, gato, ave, etc.                          |
     | Raza                | VARCHAR(50)  | Si se deja vacía, se guarda como "desconocida"  |
     | Dueno               | VARCHAR(100) | Nombre del propietario                          |
     | Direccion           | VARCHAR(200) | Dirección de residencia del dueño               |
     | Numero              | VARCHAR(20)  | Número de contacto del dueño                    |
     | EnEstablecimiento   | VARCHAR(2)   | 'si' o 'no'                                     |

   El script también inserta algunos registros de ejemplo (puedes borrar
   ese bloque `INSERT` si no los necesitas).

## 2) Configurar la conexión (de forma dinámica)

La aplicación **no tiene ningún dato de conexión "quemado" en el código**.
Todo se lee desde variables de entorno, por lo que apuntar la app a otro
servidor de SQL Server es tan simple como editar un archivo `.env`.

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
2. Edita `.env` con los datos de tu servidor:
   ```
   DB_SERVER=localhost              # IP, hostname, o "IP\INSTANCIA"
   DB_PORT=1433
   DB_DATABASE=PatitasConAmor
   DB_USER=sa
   DB_PASSWORD=TuPasswordSeguro
   DB_ENCRYPT=false                 # usar "true" si es Azure SQL
   DB_TRUST_SERVER_CERTIFICATE=true
   PORT=3000
   ```

   Si en algún momento cambias de servidor (por ejemplo, pasas de un
   entorno local a uno en la nube), solo debes actualizar estos valores;
   el código de la aplicación no necesita ningún cambio (arquitectura
   modular: `src/config/db.js` centraliza toda la configuración).

### 2.1) Si el servidor NO requiere usuario/contraseña (Autenticación de Windows)

Si te conectas al servidor usando tu sesión de Windows (como en SSMS cuando
eliges "Windows Authentication"), configura tu `.env` así:

```
DB_SERVER=NOMBRE_O_IP_DEL_SERVIDOR
DB_DATABASE=PatitasConAmor
DB_AUTH_TYPE=windows
DB_TRUST_SERVER_CERTIFICATE=true
```

No necesitas definir `DB_USER`, `DB_PASSWORD` ni `DB_PORT` en este modo.

⚠️ Este modo usa el driver nativo `msnodesqlv8`, que requiere herramientas
de compilación en Windows (Visual Studio Build Tools con "Desktop
development with C++", o el paquete `windows-build-tools`) porque compila
un addon nativo durante `npm install`. Si tu equipo no las tiene:

```bash
npm install --global windows-build-tools
```
(ejecútalo como administrador), y luego corre `npm install` nuevamente en
el proyecto.

## 3) Instalar dependencias y ejecutar

```bash
npm install
npm start        # o "npm run dev" si tienes nodemon para recarga automática
```

La aplicación quedará disponible en `http://localhost:3000` (o el puerto
que hayas definido en `PORT`).

## 4) Funcionalidades

- **Listar** todas las mascotas registradas, con su estado de
  "En establecimiento" (Sí/No) resaltado visualmente.
- **Crear** una nueva mascota. Si el campo "Raza" se deja vacío, se guarda
  automáticamente como `"desconocida"`.
- **Editar** los datos de una mascota existente.
- **Eliminar** una mascota (con confirmación antes de borrar).
- El campo **Id** nunca se expone como campo editable en los formularios;
  solo se usa internamente para identificar cada registro.

## Notas técnicas

- **Modularidad**: la lógica está separada en capas (`config`, `models`,
  `controllers`, `routes`), por lo que agregar nuevas entidades (por
  ejemplo, "Citas médicas") es tan simple como replicar el mismo patrón.
- **Pool de conexiones**: `src/config/db.js` reutiliza un único pool de
  conexiones para toda la app y se reconecta automáticamente si la
  conexión inicial falla.
- **method-override**: se usa para poder enviar peticiones `PUT` y
  `DELETE` desde formularios HTML normales (que solo soportan GET/POST).
