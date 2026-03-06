# Nexus Finance

A full-stack personal finance management application built with React and Node.js. Track income and expenses, manage budgets, set savings goals, and visualize your financial health with interactive charts.

## Features

- **Authentication** — Register, login, logout with JWT access + refresh token rotation via HttpOnly cookies
- **Onboarding** — First-time setup for currency preference, monthly income, and expense categories
- **Transactions** — Create, edit, delete, and bulk-delete income/expense records with tags and notes; filter by date, type, and category; export to CSV
- **Budget Tracking** — Set monthly category budgets; real-time spent tracking with overspend notifications
- **Savings Goals** — Create goals with target amounts and deadlines; track progress with contributions; projected completion date
- **Analytics Dashboard** — Six-month income vs expense bar chart, category spending donut, cash flow area chart, budget radial chart, and smart insights
- **Reports** — Advanced filtering by date range, type, category, amount range, and tags; export to CSV, PDF, or print
- **Notifications** — In-app alerts for budget overruns and completed savings goals

## Tech Stack

### Client (`nexus-finance-client`)
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| React Router v7 | Client-side routing |
| Zustand | Global state management |
| Axios | HTTP client with request/response interceptors |
| React Bootstrap + Bootstrap 5 | UI component library |
| Recharts | Data visualization charts |
| React Icons | Icon library |
| html2canvas + jsPDF | PDF report export |
| canvas-confetti | Goal completion celebration |

### Server (`nexus-finance-server`)
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database and ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT access and refresh token generation |
| cookie-parser | HttpOnly refresh token handling |
| helmet + cors | Security headers and cross-origin policy |
| express-rate-limit | API rate limiting |
| dotenv | Environment variable management |
| Cloudinary + multer | Image upload (avatar) |

## Project Structure

```
Nexus/
├── nexus-finance-client/       # React frontend
│   └── src/
│       ├── api/                # Axios API functions
│       ├── components/         # Reusable UI components
│       │   ├── budgets/
│       │   ├── charts/
│       │   ├── goals/
│       │   └── transactions/
│       ├── layout/             # Sidebar, Topbar, Layout wrapper
│       ├── pages/              # Route-level page components
│       ├── routes/             # ProtectedRoute guard
│       └── store/              # Zustand stores
│
└── nexus-finance-server/       # Express backend
    ├── controllers/            # Request handlers
    ├── middleware/             # Auth + error handling middleware
    ├── models/                 # Mongoose schemas
    └── routes/                 # Express route definitions
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB instance)

### Server Setup

```bash
cd nexus-finance-server
npm install
```

Create a `.env` file (see `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/nexus-finance
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

### Client Setup

```bash
cd nexus-finance-client
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get tokens |
| POST | `/api/auth/logout` | Clear refresh token |
| POST | `/api/auth/refresh` | Rotate access token |
| POST | `/api/auth/onboard` | Complete first-time setup |
| GET/PUT | `/api/auth/profile` | Get or update profile |
| GET/POST | `/api/transactions` | List or create transactions |
| GET/PUT/DELETE | `/api/transactions/:id` | Single transaction operations |
| DELETE | `/api/transactions/bulk` | Bulk delete |
| GET | `/api/transactions/export/csv` | CSV export |
| GET/POST | `/api/budgets` | List or create budgets |
| PUT/DELETE | `/api/budgets/:id` | Update or delete budget |
| GET/POST | `/api/goals` | List or create savings goals |
| GET/PUT/DELETE | `/api/goals/:id` | Single goal operations |
| POST | `/api/goals/:id/contribute` | Add contribution to goal |
| GET | `/api/analytics/summary` | Dashboard summary cards |
| GET | `/api/analytics/monthly-trend` | 6-month income/expense trend |
| GET | `/api/analytics/category-breakdown` | Spending by category |
| GET | `/api/analytics/cash-flow` | Running balance over time |
| GET | `/api/analytics/budget-usage` | Budget utilization per category |
| GET | `/api/analytics/insights` | Smart financial insights |
| GET | `/api/notifications` | List notifications |
| PUT | `/api/notifications/:id` | Mark notification as read |
| PUT | `/api/notifications/read-all` | Mark all as read |

## Authentication Flow

1. On login, server issues a short-lived **access token** (15 min) in the response body and a long-lived **refresh token** (7 days) as an HttpOnly cookie.
2. The client stores the access token in `localStorage` and attaches it to every request via an Axios request interceptor.
3. On a `401` response, the Axios response interceptor automatically calls `/auth/refresh` to obtain a new access token and retries the original request.
4. On logout (or failed refresh), local storage is cleared and the user is redirected to `/login`.
