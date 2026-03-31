# 🚗 DriveHub — Full-Stack Car Dealership Platform

A modern, full-stack car dealership web application built with Next.js, Express, PostgreSQL, and Stripe payments.

---

## 📸 Features

- 🔐 **Authentication** — Register, login, JWT access + refresh tokens
- 🚘 **Vehicle Inventory** — Browse, filter, and search vehicles
- 💳 **Stripe Payments** — Secure checkout with real payment processing
- 📅 **Test Drive Booking** — Schedule test drives for any vehicle
- ❤️ **Wishlist** — Save favourite vehicles
- 📦 **Order Management** — Track purchase history and order status
- 👤 **User Dashboard** — Manage orders, test drives, wishlist, settings
- 🛠️ **Admin Panel** — Manage inventory, users, orders, test drives
- 🤖 **AI Chatbot** — Claude-powered assistant for customer support
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Frontend   | Next.js 14, TypeScript, Tailwind CSS |
| Backend    | Node.js, Express.js, TypeScript      |
| Database   | PostgreSQL (Neon cloud)              |
| ORM        | Prisma 6                             |
| Auth       | JWT (Access + Refresh tokens)        |
| Payments   | Stripe                               |
| AI Chatbot | Claude API (Anthropic)               |
| Icons      | Lucide React                         |

---

## 📁 Project Structure

```
car-dealer/
├── client/                  # Next.js frontend (port 3000)
│   ├── app/
│   │   ├── (auth)/          # Login & Register pages
│   │   ├── (main)/          # Public pages (Home, Vehicles, About, Contact)
│   │   ├── dashboard/       # User dashboard (Orders, Wishlist, Test Drives, Settings)
│   │   ├── admin/           # Admin panel (Inventory, Users, Orders, Test Drives)
│   │   ├── checkout/        # Stripe checkout & success page
│   │   └── api/chat/        # AI chatbot API route
│   ├── components/          # Reusable UI components
│   ├── context/             # Auth & Toast context providers
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # API client, utils, validations
│   └── types/               # TypeScript interfaces
│
└── server/                  # Express backend (port 5000)
    ├── prisma/
    │   ├── schema.prisma    # Database models
    │   └── seed.ts          # Sample data seeder
    └── src/
        ├── controllers/     # Route handlers
        ├── middleware/      # Auth, error handling, validation
        ├── routes/          # API route definitions
        └── utils/           # JWT helpers, Prisma client
```

---

## ⚙️ Environment Variables

### `server/.env`

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"

# JWT Secrets (use long random strings)
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### `client/.env.local`

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# AI Chatbot (Anthropic)
ANTHROPIC_API_KEY=sk-ant-your_anthropic_api_key
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL database (or [Neon](https://neon.tech) free cloud DB)
- Stripe account

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd car-dealer
```

### 2. Install Server dependencies

```bash
cd server
npm install
```

### 3. Install Client dependencies

```bash
cd ../client
npm install
```

### 4. Set up environment variables

Create `server/.env` and `client/.env.local` using the variables listed above.

### 5. Set up the Database

```bash
cd server

# Generate Prisma client
npx prisma generate

# Push schema to database (creates all tables)
npx prisma db push

# Seed with sample data (optional)
npm run seed
```

### 6. Run the application

Open **3 terminals**:

```bash
# Terminal 1 — Backend server
cd server
npm run dev
```

```bash
# Terminal 2 — Frontend
cd client
npm run dev
```

```bash
# Terminal 3 — Stripe webhook listener (for local testing)
stripe listen --forward-to localhost:5000/api/payments/webhook
```

The app will be running at **http://localhost:3000** 🎉

### 🌐 Live Demo: [https://car-dealer-website-chi.vercel.app/](https://car-dealer-website-chi.vercel.app/)
---


## 🔑 Getting API Keys

### Stripe

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) and create an account
2. Go to **Developers → API Keys**
3. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Copy **Secret key** → `STRIPE_SECRET_KEY`
5. Run `stripe listen --forward-to localhost:5000/api/payments/webhook` to get `STRIPE_WEBHOOK_SECRET`

### Anthropic (AI Chatbot)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Go to **API Keys** and create a new key
3. Copy it → `ANTHROPIC_API_KEY`

### Neon (PostgreSQL)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string → `DATABASE_URL`

---

## 🧪 Test Stripe Payments

Use these card numbers in test mode — no real money is charged:

| Card Number           | Result                |
| --------------------- | --------------------- |
| `4242 4242 4242 4242` | ✅ Payment Success    |
| `4000 0000 0000 0002` | ❌ Card Declined      |
| `4000 0025 0000 3155` | 🔐 Requires 3D Secure |

**Other fields:** Any future expiry date (e.g. `12/34`), any 3-digit CVC (e.g. `123`), any ZIP code (e.g. `12345`)

---

## 📡 API Endpoints

### Auth

| Method | Endpoint                    | Description          |
| ------ | --------------------------- | -------------------- |
| POST   | `/api/auth/register`        | Register new user    |
| POST   | `/api/auth/login`           | Login                |
| POST   | `/api/auth/logout`          | Logout               |
| GET    | `/api/auth/me`              | Get current user     |
| PUT    | `/api/auth/profile`         | Update profile       |
| PUT    | `/api/auth/change-password` | Change password      |
| POST   | `/api/auth/refresh-token`   | Refresh access token |

### Vehicles

| Method | Endpoint                 | Description                     |
| ------ | ------------------------ | ------------------------------- |
| GET    | `/api/vehicles`          | Get all vehicles (with filters) |
| GET    | `/api/vehicles/:id`      | Get vehicle by ID               |
| GET    | `/api/vehicles/featured` | Get featured vehicles           |
| GET    | `/api/vehicles/search`   | Search vehicles                 |
| POST   | `/api/vehicles`          | Create vehicle (Admin)          |
| PUT    | `/api/vehicles/:id`      | Update vehicle (Admin)          |
| DELETE | `/api/vehicles/:id`      | Delete vehicle (Admin)          |

### Orders

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| POST   | `/api/orders`            | Create order        |
| GET    | `/api/orders`            | Get orders          |
| GET    | `/api/orders/:id`        | Get order by ID     |
| PUT    | `/api/orders/:id/status` | Update order status |
| DELETE | `/api/orders/:id`        | Cancel order        |

### Payments

| Method | Endpoint                        | Description                    |
| ------ | ------------------------------- | ------------------------------ |
| POST   | `/api/payments/create-intent`   | Create Stripe payment intent   |
| POST   | `/api/payments/confirm`         | Confirm payment after redirect |
| POST   | `/api/payments/webhook`         | Stripe webhook handler         |
| GET    | `/api/payments/:orderId/status` | Get payment status             |

### Test Drives

| Method | Endpoint               | Description       |
| ------ | ---------------------- | ----------------- |
| POST   | `/api/test-drives`     | Book a test drive |
| GET    | `/api/test-drives`     | Get test drives   |
| PUT    | `/api/test-drives/:id` | Update test drive |
| DELETE | `/api/test-drives/:id` | Cancel test drive |

### Wishlist

| Method | Endpoint                         | Description          |
| ------ | -------------------------------- | -------------------- |
| GET    | `/api/wishlist`                  | Get wishlist         |
| POST   | `/api/wishlist`                  | Add to wishlist      |
| DELETE | `/api/wishlist/:vehicleId`       | Remove from wishlist |
| GET    | `/api/wishlist/check/:vehicleId` | Check if wishlisted  |

### Admin

| Method | Endpoint                    | Description         |
| ------ | --------------------------- | ------------------- |
| GET    | `/api/admin/stats`          | Get dashboard stats |
| GET    | `/api/admin/users`          | Get all users       |
| PUT    | `/api/admin/users/:id/role` | Update user role    |
| GET    | `/api/admin/reports`        | Get sales reports   |

---

## 🗄️ Database Models

- **User** — Customers, Admins, Sales Agents
- **Vehicle** — Car listings with images, specs, features
- **VehicleImage** — Multiple images per vehicle
- **Order** — Purchase orders with payment tracking
- **TestDriveBooking** — Scheduled test drives
- **Wishlist** — Saved vehicles per user
- **Review** — Vehicle reviews and ratings

---

## 👤 User Roles

| Role          | Access                                                         |
| ------------- | -------------------------------------------------------------- |
| `CUSTOMER`    | Browse, purchase, wishlist, test drives, dashboard             |
| `SALES_AGENT` | All customer access + view all orders & test drives            |
| `ADMIN`       | Full access including inventory management and user management |

---

## 📜 Available Scripts

### Server

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run start    # Start production server
npm run seed     # Seed database with sample data
```

### Client

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🌐 Pages

| Page              | Route                    | Access        |
| ----------------- | ------------------------ | ------------- |
| Home              | `/`                      | Public        |
| Vehicle Inventory | `/vehicles`              | Public        |
| Vehicle Detail    | `/vehicles/:id`          | Public        |
| About             | `/about`                 | Public        |
| Contact           | `/contact`               | Public        |
| Login             | `/login`                 | Guest only    |
| Register          | `/register`              | Guest only    |
| Checkout          | `/checkout`              | Authenticated |
| Payment Success   | `/checkout/success`      | Authenticated |
| User Dashboard    | `/dashboard`             | Authenticated |
| My Orders         | `/dashboard/orders`      | Authenticated |
| My Test Drives    | `/dashboard/test-drives` | Authenticated |
| My Wishlist       | `/dashboard/wishlist`    | Authenticated |
| Settings          | `/dashboard/settings`    | Authenticated |
| Admin Dashboard   | `/admin/dashboard`       | Admin only    |
| Admin Inventory   | `/admin/inventory`       | Admin only    |
| Admin Orders      | `/admin/orders`          | Admin only    |
| Admin Test Drives | `/admin/test-drives`     | Admin only    |
| Admin Users       | `/admin/users`           | Admin only    |

---

## 🔐 Test Login Credentials

> Make sure you have run `npm run seed` in the server folder first.

### Admin

| Field    | Value                           |
| -------- | ------------------------------- |
| Email    | `admin@drivehub.com`            |
| Password | `Admin123!`                     |
| Access   | Full admin panel + all features |

### Sales Agent

| Field    | Value                         |
| -------- | ----------------------------- |
| Email    | `sarah@drivehub.com`          |
| Password | `Admin123!`                   |
| Access   | View all orders & test drives |
