# 🚀 Movil Express - E-commerce Landing Page

Una landing page completa de e-commerce para venta de dispositivos móviles y tecnología, desarrollada con **Next.js 14**, **TypeScript**, **MySQL** y **Tailwind CSS**.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Base de Datos](#-base-de-datos)
- [APIs](#-apis)
- [Funcionalidades](#-funcionalidades)
- [Uso](#-uso)
- [Deployment](#-deployment)
- [Contribución](#-contribución)

## ✨ Características

### 🛍️ **E-commerce Completo**
- Catálogo de productos con filtros avanzados
- Carrito de compras persistente
- Sistema de checkout con MercadoPago
- Gestión de pedidos y estados
- Sistema de reviews y ratings

### 🎨 **Diseño Moderno**
- Diseño responsive y mobile-first
- Interfaz elegante con Tailwind CSS
- Componentes reutilizables con shadcn/ui
- Animaciones y transiciones suaves
- Dark/Light mode support

### 🔐 **Sistema de Autenticación**
- Login/registro de usuarios
- Panel de administración
- Roles y permisos
- Sesiones seguras con JWT

### 📊 **Panel de Administración**
- Dashboard con estadísticas en tiempo real
- CRUD completo de productos
- Gestión de categorías y características
- Administración de pedidos
- Sistema de configuración

### 🚀 **Performance y SEO**
- Server-side rendering (SSR)
- Optimización de imágenes
- Meta tags dinámicos
- Sitemap automático
- Core Web Vitals optimizados

## 🛠️ Tecnologías

### **Frontend**
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI modernos
- **Zustand** - Gestión de estado global
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

### **Backend**
- **Next.js API Routes** - API RESTful
- **MySQL** - Base de datos relacional
- **mysql2** - Driver de MySQL para Node.js
- **JWT** - Autenticación con tokens
- **bcryptjs** - Hash de contraseñas

### **Integraciones**
- **MercadoPago** - Pasarela de pagos
- **Nodemailer** - Envío de emails
- **Sharp** - Procesamiento de imágenes

## 📦 Instalación

### **Prerrequisitos**
- Node.js 18+ 
- MySQL 8.0+
- npm o yarn

### **Clonar el repositorio**
\`\`\`bash
git clone https://github.com/tu-usuario/movil-express.git
cd movil-express
\`\`\`

### **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

### **Configurar variables de entorno**
\`\`\`bash
cp .env.example .env.local
\`\`\`

Editar `.env.local` con tus configuraciones:
\`\`\`env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=movil_express_db

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_REFRESH_SECRET=tu_refresh_secret_muy_seguro

# MercadoPago
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=tu_public_key
MERCADOPAGO_ACCESS_TOKEN=tu_access_token

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## ⚙️ Configuración

### **1. Configurar Base de Datos**
\`\`\`bash
# Inicializar base de datos automáticamente
node scripts/init-database.js

# O manualmente:
mysql -u root -p
source scripts/01-create-database.sql
source scripts/02-seed-data.sql
\`\`\`

### **2. Verificar Conexión**
\`\`\`bash
node scripts/test-connection.js
\`\`\`

### **3. Ejecutar en Desarrollo**
\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

\`\`\`
movil-express/
├── app/                          # App Router de Next.js
│   ├── api/                      # API Routes
│   │   ├── productos/            # CRUD de productos
│   │   ├── auth/                 # Autenticación
│   │   ├── pedidos/              # Gestión de pedidos
│   │   └── admin/                # APIs de administración
│   ├── admin/                    # Panel de administración
│   ├── catalogo/                 # Página de catálogo
│   ├── carrito/                  # Carrito de compras
│   └── checkout/                 # Proceso de compra
├── components/                   # Componentes React
│   ├── ui/                       # Componentes base (shadcn/ui)
│   ├── admin/                    # Componentes del admin
│   └── modals/                   # Modales y overlays
├── hooks/                        # Custom hooks
├── lib/                          # Utilidades y configuración
│   ├── services/                 # Servicios de base de datos
│   ├── validations.ts            # Esquemas de validación
│   ├── database.ts               # Conexión a MySQL
│   └── auth.ts                   # Utilidades de autenticación
├── types/                        # Tipos TypeScript
├── scripts/                      # Scripts de base de datos
└── public/                       # Archivos estáticos
\`\`\`

## 🗄️ Base de Datos

### **Esquema Principal**

\`\`\`sql
-- Tablas principales
usuarios              # Clientes y administradores
productos             # Catálogo de productos
categorias            # Categorías de productos
pedidos               # Órdenes de compra
carrito               # Carritos de compra
pagos_mercadopago     # Transacciones de pago

-- Tablas de relación
producto_categorias   # Productos ↔ Categorías
producto_imagenes     # Imágenes de productos
producto_caracteristicas # Características técnicas
producto_colores      # Colores disponibles
pedido_items          # Items de cada pedido
carrito_items         # Items del carrito

-- Tablas de configuración
configuracion_sitio   # Configuración dinámica
ubicaciones           # Tiendas físicas
reviews               # Reseñas de productos
logs_actividad        # Auditoría del sistema
\`\`\`

### **Relaciones Clave**
- Un producto puede tener múltiples categorías (N:M)
- Un producto tiene múltiples imágenes, características y colores (1:N)
- Un pedido contiene múltiples productos (1:N)
- Un usuario puede tener múltiples pedidos (1:N)

## 🔌 APIs

### **Productos**
\`\`\`typescript
GET    /api/productos              # Listar con filtros
GET    /api/productos/[id]         # Obtener por ID
POST   /api/productos              # Crear (admin)
PUT    /api/productos/[id]         # Actualizar (admin)
DELETE /api/productos/[id]         # Eliminar (admin)
GET    /api/productos/estadisticas # Estadísticas (admin)
\`\`\`

### **Autenticación**
\`\`\`typescript
POST   /api/auth/login             # Iniciar sesión
POST   /api/auth/register          # Registrarse
POST   /api/auth/logout            # Cerrar sesión
GET    /api/auth/me                # Perfil actual
POST   /api/auth/refresh           # Renovar token
\`\`\`

### **Pedidos**
\`\`\`typescript
GET    /api/pedidos                # Listar pedidos
POST   /api/pedidos                # Crear pedido
GET    /api/pedidos/[id]           # Obtener pedido
PUT    /api/pedidos/[id]           # Actualizar estado
\`\`\`

### **Carrito**
\`\`\`typescript
GET    /api/carrito                # Obtener carrito
POST   /api/carrito/items          # Agregar item
PUT    /api/carrito/items/[id]     # Actualizar cantidad
DELETE /api/carrito/items/[id]     # Eliminar item
\`\`\`

## 🎯 Funcionalidades

### **Para Clientes**
- ✅ Navegación intuitiva del catálogo
- ✅ Búsqueda y filtros avanzados
- ✅ Carrito de compras persistente
- ✅ Checkout con MercadoPago
- ✅ Seguimiento de pedidos
- ✅ Sistema de reviews
- ✅ Wishlist de productos
- ✅ Historial de compras

### **Para Administradores**
- ✅ Dashboard con métricas
- ✅ Gestión completa de productos
- ✅ Administración de categorías
- ✅ Control de inventario
- ✅ Gestión de pedidos
- ✅ Reportes y estadísticas
- ✅ Configuración del sitio
- ✅ Gestión de usuarios

## 🚀 Uso

### **Credenciales de Prueba**

**Administrador:**
- Email: `admin@movilexpress.com`
- Password: `admin123`

**Cliente de Prueba:**
- Email: `cliente@test.com`
- Password: `cliente123`

### **Flujo de Compra**
1. Navegar el catálogo
2. Filtrar productos por categoría/precio
3. Ver detalles del producto
4. Agregar al carrito
5. Proceder al checkout
6. Completar datos de envío
7. Pagar con MercadoPago
8. Recibir confirmación por email

### **Panel de Administración**
1. Acceder a `/admin`
2. Iniciar sesión como administrador
3. Gestionar productos desde el dashboard
4. Monitorear pedidos y estadísticas
5. Configurar opciones del sitio

## 📈 Performance

### **Optimizaciones Implementadas**
- ✅ Server-side rendering (SSR)
- ✅ Lazy loading de imágenes
- ✅ Code splitting automático
- ✅ Compresión de assets
- ✅ Cache de base de datos
- ✅ Optimización de consultas SQL
- ✅ CDN para imágenes

### **Métricas Objetivo**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## 🚀 Deployment

### **Vercel (Recomendado)**
\`\`\`bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variables de entorno en Vercel Dashboard
\`\`\`

### **Docker**
\`\`\`bash
# Build imagen
docker build -t movil-express .

# Ejecutar contenedor
docker run -p 3000:3000 movil-express
\`\`\`

### **Variables de Entorno en Producción**
Asegúrate de configurar todas las variables de entorno en tu plataforma de deployment.

## 🤝 Contribución

### **Cómo Contribuir**
1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

### **Estándares de Código**
- Usar TypeScript para todo el código
- Seguir las convenciones de ESLint
- Escribir tests para nuevas funcionalidades
- Documentar APIs y componentes complejos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollador Full Stack** - Implementación completa
- **Diseñador UI/UX** - Diseño de interfaz
- **DevOps** - Configuración de infraestructura

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: soporte@movilexpress.com
- GitHub Issues: [Crear Issue](https://github.com/tu-usuario/movil-express/issues)
- Documentación: [Wiki del Proyecto](https://github.com/tu-usuario/movil-express/wiki)

---

**¡Gracias por usar Movil Express!** 🚀📱
