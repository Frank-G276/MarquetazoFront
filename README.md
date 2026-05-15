# Marquetazo Front

SPA del supermercado digital Marquetazo. Permite a clientes explorar productos, gestionar su carrito y realizar pedidos. Empleados y administradores cuentan con paneles de gestión.

## Stack

- **React 19**
- **Vite 8**
- **Tailwind CSS 4**
- **React Router 7**

## Requisitos

- Node.js `>= 20.19`
- [MarquetazoApi](../MarquetazoApi) corriendo en `http://localhost:4000`

## Instalación

```bash
cd MarquetazoFront
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE=/api
VITE_API_URL=http://localhost:4000
```

| Variable | Descripción |
|---|---|
| `VITE_API_BASE` | Prefijo de las rutas de la API (`/api`) |
| `VITE_API_URL` | URL base del backend (usada por el proxy de Vite en desarrollo) |

> El proxy de Vite redirige `/api` al backend. En producción no es necesario exponer la URL pública.

## Scripts

```bash
# Servidor de desarrollo con hot-reload
npm run dev

# Compilar para producción
npm run build

# Previsualizar el build de producción
npm run preview

# Lint
npm run lint
```

El servidor de desarrollo corre en `http://localhost:5173`.

## Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Inicio | Público |
| `/tienda` | Tienda | Público |
| `/buscar` | Resultados de búsqueda | Público |
| `/producto/:id` | Detalle de producto | Público |
| `/nosotros` | Acerca de | Público |
| `/contacto` | Contacto | Público |
| `/envios` | Política de envíos | Público |
| `/privacidad` | Política de privacidad | Público |
| `/login` | Iniciar sesión | Público |
| `/registro` | Registrarse | Público |
| `/carrito` | Carrito | Autenticado |
| `/mis-pedidos` | Mis pedidos | Autenticado |
| `/perfil` | Perfil | Autenticado |
| `/panel` | Gestión de productos | Empleado / Admin |
| `/admin` | Panel de administración | Admin |

## Roles

| Rol | Acceso |
|---|---|
| `CLIENTE` | Tienda, carrito, pedidos propios, perfil |
| `EMPLEADO` | Todo lo anterior + gestión de productos (`/panel`) |
| `ADMIN` | Todo lo anterior + categorías y estados de órdenes (`/admin`) |

## Estructura

```
src/
├── api/          # Funciones de llamadas a la API
├── components/   # Componentes reutilizables (Navbar, Layout, ProductCard…)
├── context/      # Contextos globales (Auth, Cart, Products, Categories)
├── pages/        # Páginas de la aplicación
└── utils/        # Utilidades (formateo de precios, imágenes…)
```
