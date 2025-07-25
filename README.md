# 📝 Blog API - Node.js + Express + Prisma

Este proyecto es una API RESTful de un blog con autenticación JWT, subida de imágenes a Cloudinary y base de datos MySQL, desarrollado en Node.js y Express con Prisma ORM y TypeScript.

---

## 🚀 Características

* Autenticación de usuarios con JWT (access & refresh tokens).
* CRUD de publicaciones (posts) con imágenes subidas a Cloudinary.
* CRUD de comentarios asociados a publicaciones.
* Paginación en listados.
* Validación de entradas y seguridad.
* Pruebas unitarias con Jest.

---

## 📦 Requisitos

* Node.js v20+
* npm v8+
* Docker y Docker Compose (opcional, para base de datos)

---

## 📥 Instalación

### 1. Clona el repositorio

```bash
git clone git@github.com:jmunozf96/blog-api.git
cd blog-api
```

### 2. Configura el archivo `.env`

Crea el archivo `.env` en la raíz y agrega las siguientes variables:

```env
# JWT
JWT_SECRET_KEY=
JWT_REFRESH_SECRET_KEY=
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Base de datos MySQL
DATABASE_HOST=
DATABASE_PORT=
DATABASE=blog-db
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_URL="mysql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE}"

# Cloudinary
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 🐳 Opcional: Levantar base de datos con Docker

### 1. Ejecuta el contenedor de MySQL

```bash
docker-compose up -d
```

Esto iniciará un contenedor MySQL y ejecutará automáticamente el script db/init.sql para crear la base de datos inicial.

Las credenciales que se generan son:
```text
DATABASE_HOST=localhost
DATABASE_PORT=3310
DATABASE=blog-db
DATABASE_USER=root
DATABASE_PASSWORD=w&P:Z2^VhzRCVt2r,4B4
```

> 💡 Alternativa sin Docker:
> Si prefieres usar tu propia instancia de MySQL (sin Docker), primero ejecuta el script db/init.sql manualmente para crear la base de datos.
> Luego, asegúrate de configurar correctamente el archivo .env con las credenciales de tu base de datos antes de ejecutar las migraciones de Prisma.

---

## 💠 Configuración del proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Generar Prisma Client

```bash
npx prisma generate
```

### 3. Ejecutar migraciones

```bash
npx prisma migrate dev
```

### 4. Ejecutar seed de datos

```bash
npx prisma db seed
```

### 5. Iniciar servidor

```bash
npm run start:watch
```

---

## 📬 Endpoints disponibles

### 🔐 Auth

| Método | Ruta            | Descripción         |
| ------ | --------------- | ------------------- |
| POST   | `/auth/signup`  | Registro de usuario |
| POST   | `/auth/login`   | Login y JWT tokens  |
| POST   | `/auth/refresh` | Refresh token JWT   |

---

### 👤 Account

| Método | Ruta          | Descripción           |
| ------ | ------------- | --------------------- |
| GET    | `/account/me` | Obtener cuenta actual |

---

### 📜 Posts

| Método | Ruta         | Descripción                       |
| ------ | ------------ | --------------------------------- |
| POST   | `/posts/`    | Crear post (requiere imagen)      |
| GET    | `/posts/`    | Listar posts paginados            |
| GET    | `/posts/:id` | Obtener post por ID               |
| PUT    | `/posts/:id` | Actualizar post (imagen opcional) |
| DELETE | `/posts/:id` | Eliminar post                     |

---

### 💬 Comments

| Método | Ruta                                 | Descripción                              |
| ------ | ------------------------------------ | ---------------------------------------- |
| POST   | `/posts/:postId/comments/`           | Crear comentario en un post              |
| GET    | `/posts/:postId/comments/`           | Listar comentarios del post (paginado)   |
| PUT    | `/posts/:postId/comments/:commentId` | Actualizar comentario propio             |
| DELETE | `/posts/:postId/comments/:commentId` | Eliminar comentario (autor o dueño post) |

---

📅 Formato de fechas en filtros
Al usar filtros por fecha en los endpoints (por ejemplo, para publicaciones), debes enviar las fechas en formato ISO 8601 en zona horaria UTC.

✅ Ejemplos válidos:
- `2025-07-01T00:00:00Z`
- `2025-12-31T23:59:59Z`

❌ Evita:
Fechas sin zona horaria (p. ej., 2025-07-01) ya que se interpretan como hora local.

Formatos no estándar (p. ej., 07/01/2025 o 01-07-2025).

⚠️ Nota importante:
Todas las fechas se almacenan y comparan en UTC. Es responsabilidad del frontend convertir las fechas a la zona horaria del usuario al mostrarlas.

```bash
GET /posts?publishedAfter=2025-01-01T00:00:00Z&publishedBefore=2025-12-31T23:59:59Z
```

---

## 📂 Postman Collection

Importa la colección Postman desde el archivo:

`docs/blog-api.postman_collection.json`

---

## 🐘 Base de datos y script manual

Si no usas Docker, ejecuta el script `db/init.sql` en tu instancia MySQL manualmente **antes de las migraciones**.

---

## ✅ Scripts útiles

```bash
npm run build          # Compilar TypeScript
npm run start:watch    # Iniciar en modo watch
npm test               # Ejecutar pruebas
```

---
