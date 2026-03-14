# Backend Glicemias API

Backend desarrollado en **Node.js + TypeScript + Express + MongoDB**, diseñado para el registro y control de mediciones de glucosa, con autenticación JWT, roles de usuario y arquitectura modular preparada para crecimiento futuro, integración con aplicaciones móviles (Ionic) y generación automática de código mediante AI Skills.

---

## 🚀 Tecnologías

* Node.js
* TypeScript
* Express
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcrypt
* dotenv
* ExcelJS (reportes)
* Arquitectura modular
* AI Skills ready
* AGENTS.md ready

---

## 📁 Estructura del proyecto

```
backend-glicemia/

src/
  config/
  middleware/
  routes/

  modules/
    auth/
    users/
    glicemias/
    reportes/

skills/
ai/
AGENTS.md

.env
package.json
tsconfig.json
README.md
```

---

## 🔐 Autenticación

Se usa JWT para proteger endpoints.

Header requerido:

```
Authorization: TOKEN
```

Login devuelve:

```
token
role
name
```

Roles disponibles:

```
ADMIN
USER
```

---

## 👤 Usuarios

* Registro crea usuario con role USER por defecto
* ADMIN puede editar usuarios
* ADMIN puede cambiar roles
* JWT contiene id y role

Endpoints:

```
POST /api/auth/register
POST /api/auth/login

GET /api/users
PUT /api/users/:id
PUT /api/users/role/:id
```

---

## 🩸 Glicemias

Cada medición está asociada al usuario autenticado.

Campos:

```
valor
tipo
fecha
user
```

Endpoints:

```
POST /api/glicemias
GET /api/glicemias
GET /api/glicemias/:id
PUT /api/glicemias/:id
DELETE /api/glicemias/:id
```

Protección:

```
JWT required
```

---

## 📊 Reportes (Excel)

Módulo preparado para exportar glicemias a Excel.

Endpoint:

```
GET /api/reportes/glicemias/excel
```

Reglas:

```
< 70  -> BAJA (rojo)
70-140 -> NORMAL (verde)
> 140 -> ALTA (rojo)
```

Usa:

```
exceljs
```

---

## 🧠 AI / Skills / Agents

El proyecto está preparado para generación automática de código.

Estructura:

```
skills/
ai/context
ai/rules
AGENTS.md
```

Los agentes deben leer:

```
AGENTS.md
```

antes de generar código.

---

## ⚙️ Variables de entorno

Archivo `.env`

```
PORT=3000

MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/glicemiaDB

JWT_SECRET=secret
```

---

## ▶️ Ejecutar proyecto

Instalar dependencias:

```
npm install
```

Modo desarrollo:

```
npm run dev
```

Build:

```
npm run build
```

Run:

```
npm start
```

---

## 📱 Integración futura

Preparado para:

* Ionic
* Angular
* React
* Mobile apps
* Reportes PDF
* Reportes Excel
* Multi usuario
* Pacientes
* Médicos
* Familiares

---

## 📌 Arquitectura

Cada módulo debe contener:

```
model
controller
routes
service (opcional)
```

Ubicación:

```
src/modules/{module}
```

Middleware:

```
auth.middleware
admin.middleware
```

---

## 📌 Reglas del proyecto

* TypeScript obligatorio
* Express Router obligatorio
* Mongoose obligatorio
* JWT obligatorio
* No modificar módulos sin necesidad
* Nuevos módulos dentro de src/modules
* Mantener estructura modular

---

## 👨‍💻 Autor

Gustavo Adolfo Muñoz Reyes
Senior Developer