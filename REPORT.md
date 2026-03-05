# Nexus Finance — Personal Finance Dashboard

## 1. Title of the Project

**Nexus Finance** — A Full-Stack Personal Finance Management Dashboard built on the MERN Stack.

---

## 2. Project Abstract

Nexus Finance is a full-featured personal finance web application designed to help users track income and expenses, manage monthly budgets, set savings goals, and gain meaningful insights into their spending patterns. It serves as a lightweight, self-hosted alternative to commercial tools like Mint.com.

### Purpose

The application empowers users to take control of their finances by providing a centralized dashboard where all financial data — transactions, budgets, savings goals, and analytics — is accessible at a glance. The goal is to make personal finance management simple, visual, and actionable.

### Key Functionalities

| Feature | Description |
|---------|-------------|
| **User Authentication** | Secure registration, login, and logout with JWT access tokens and httpOnly refresh token rotation. |
| **Onboarding Wizard** | First-time setup flow for users to configure income, preferred currency, and expense categories. |
| **Transaction Management** | Full CRUD for income/expense entries with category, date, tags, notes, and optional receipt upload. Supports bulk delete, pagination, and filtering. |
| **Monthly Budgets** | Create budgets per category per month with real-time spending tracking and overspend notifications. |
| **Savings Goals** | Set target-based savings goals with contribution logging, projected completion dates, and goal completion detection with confetti celebration. |
| **Analytics Dashboard** | Data-rich dashboard with summary cards (total balance, monthly income/expense, net savings) and interactive charts — bar chart for income vs. expense trends, donut chart for category breakdown, area chart for cash flow, and radial bar chart for budget usage. |
| **Smart Insights** | Automatically generated spending pattern analysis: month-over-month comparison, top spending category, savings rate, and budget alerts. |
| **Reports & Export** | Advanced filtering (date range, amount range, category, tags) with CSV and PDF export capabilities and a printable report layout. |
| **Notifications** | In-app notification system for budget overspend alerts and savings goal completion. |
| **Settings** | Profile management, currency preference, and custom expense category configuration. |

### Technologies Used

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router v7, Bootstrap 5, React-Bootstrap |
| State Management | Zustand |
| Charts | Recharts (Bar, Pie, Area, RadialBar) |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas, Mongoose ODM |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| Security | Helmet, CORS, httpOnly cookies, express-rate-limit |
| Export | jsPDF, html2canvas (PDF), server-side CSV generation |
| Other | Axios (HTTP client), React Icons, canvas-confetti |

---

## 3. High-Level Design

### 3.1 System Architecture

The application follows a standard three-tier MERN architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                    │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │
│  │  Pages   │  │Components│  │  Zustand   │  │  Axios API   │  │
│  │          │  │ (Charts, │  │  Stores    │  │  Layer with   │  │
│  │Dashboard │  │  Goals,  │  │(auth,      │  │  Interceptors│  │
│  │Transact. │  │  Budget, │  │ analytics, │  │  + Token     │  │
│  │Goals     │  │  Layout) │  │ notifs)    │  │  Refresh     │  │
│  │Reports   │  │          │  │            │  │              │  │
│  │Settings  │  │          │  │            │  │              │  │
│  └──────────┘  └──────────┘  └───────────┘  └──────┬───────┘  │
│                                                     │ HTTP     │
└─────────────────────────────────────────────────────┼──────────┘
                                                      │
                                              REST API │ (JSON)
                                                      │
┌─────────────────────────────────────────────────────┼──────────┐
│                     SERVER (Express.js)              │          │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────┴───────┐  │
│  │ Middleware  │  │   Routes   │  │     Controllers          │  │
│  │            │  │            │  │                           │  │
│  │authenticate│  │/api/auth   │  │ auth.controller.js        │  │
│  │errorHandler│  │/api/transac│  │ transaction.controller.js │  │
│  │            │  │/api/budgets│  │ budget.controller.js      │  │
│  │            │  │/api/notifs │  │ notification.controller.js│  │
│  │            │  │/api/analyt.│  │ analytics.controller.js   │  │
│  │            │  │/api/goals  │  │ goals.controller.js       │  │
│  └────────────┘  └────────────┘  └─────────────────┬────────┘  │
│                                                     │           │
└─────────────────────────────────────────────────────┼───────────┘
                                                      │
                                             Mongoose  │ ODM
                                                      │
┌─────────────────────────────────────────────────────┼───────────┐
│                   DATABASE (MongoDB Atlas)           │           │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────┴───────┐  │
│  │   Users    │ │Transactions│ │  Budgets   │ │Notifications│  │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘  │
│  ┌────────────┐                                                │
│  │SavingsGoals│                                                │
│  └────────────┘                                                │
└────────────────────────────────────────────────────────────────┘
```

### 3.2 Client-Side Architecture

```
nexus-finance-client/src/
├── api/                    # Axios HTTP client & API call modules
│   ├── axios.js            #   Configured instance with auth interceptors
│   ├── auth.api.js         #   Login, register, profile endpoints
│   ├── transactions.api.js #   Transaction CRUD + CSV export
│   ├── budgets.api.js      #   Budget CRUD
│   ├── analytics.api.js    #   Dashboard aggregation endpoints
│   └── goals.api.js        #   Savings goal CRUD + contributions
├── components/
│   ├── charts/             # Recharts visualizations
│   │   ├── IncomeExpenseBar.jsx   # 6-month income vs. expense bar chart
│   │   ├── CategoryDonut.jsx      # Spending breakdown donut/pie chart
│   │   ├── CashFlowArea.jsx       # Running balance area chart
│   │   └── BudgetRadial.jsx       # Budget usage radial bar chart
│   ├── goals/              # Savings goal UI components
│   │   ├── GoalCard.jsx           # Goal progress card with projection
│   │   ├── GoalForm.jsx           # Create/edit goal modal
│   │   └── ContributionModal.jsx  # Add contribution modal
│   ├── transactions/       # Transaction UI components
│   │   ├── TransactionList.jsx    # Paginated table with bulk select
│   │   ├── TransactionForm.jsx    # Add/edit transaction modal
│   │   └── FilterBar.jsx          # Date, type, category filters
│   └── budgets/            # Budget UI components
│       ├── BudgetCard.jsx         # Budget progress with color states
│       └── BudgetForm.jsx         # Create/edit budget modal
├── layout/                 # App shell
│   ├── Layout.jsx          #   Sidebar + Topbar + Outlet wrapper
│   ├── Sidebar.jsx         #   Navigation with icons & active states
│   └── Topbar.jsx          #   Notification bell, user info, logout
├── pages/                  # Route-level page components
│   ├── Dashboard.jsx       #   Analytics dashboard with all charts
│   ├── Transactions.jsx    #   Transaction list with CRUD
│   ├── Budgets.jsx         #   Budget management
│   ├── Goals.jsx           #   Savings goals with contributions
│   ├── Reports.jsx         #   Advanced filters + CSV/PDF export
│   ├── Settings.jsx        #   Profile & category management
│   ├── Login.jsx           #   Authentication
│   ├── Register.jsx        #   New user registration
│   └── Onboarding.jsx      #   First-time setup wizard
├── routes/
│   └── ProtectedRoute.jsx  #   Auth guard wrapper
├── store/                  # Zustand state management
│   ├── authStore.js        #   User session & token management
│   ├── analyticsStore.js   #   Dashboard data fetching & caching
│   └── notificationStore.js#   Notification state & actions
├── main.jsx                # App entry point
├── App.jsx                 # Route definitions
└── index.css               # Custom styles (sidebar, cards, print)
```

### 3.3 Server-Side Architecture

```
nexus-finance-server/
├── index.js                # Express app setup, MongoDB connection, route mounting
├── middleware/
│   ├── authenticate.js     # JWT verification middleware (Bearer token)
│   └── errorHandler.js     # Global error handler
├── models/
│   ├── User.js             # User schema (name, email, password, currency, categories)
│   ├── Transaction.js      # Transaction schema (amount, type, category, tags, date)
│   ├── Budget.js           # Budget schema (category, amount, spent, month/year)
│   ├── Notification.js     # Notification schema (message, type, isRead)
│   └── SavingsGoal.js      # Savings goal schema (target, current, contributions, deadline)
├── controllers/
│   ├── auth.controller.js          # Register, login, logout, refresh, onboard, profile
│   ├── transaction.controller.js   # CRUD, bulk delete, CSV export
│   ├── budget.controller.js        # CRUD, overspend detection
│   ├── notification.controller.js  # List, mark read, mark all read
│   ├── analytics.controller.js     # MongoDB aggregation pipelines for dashboard
│   └── goals.controller.js         # CRUD, contribution logging, completion detection
└── routes/
    ├── auth.routes.js
    ├── transaction.routes.js
    ├── budget.routes.js
    ├── notification.routes.js
    ├── analytics.routes.js
    └── goals.routes.js
```

### 3.4 Data Flow Diagram

```
User Action (e.g., adds a transaction)
        │
        ▼
  React Component (TransactionForm)
        │
        ▼
  API Layer (transactions.api.js)
        │  Axios POST with JWT Bearer token
        ▼
  Express Route (/api/transactions)
        │
        ▼
  authenticate Middleware ──► Verifies JWT, attaches userId
        │
        ▼
  Controller (transaction.controller.js)
        │  Creates document with Mongoose
        ▼
  MongoDB Atlas
        │
        ▼
  Response { success: true, data: transaction }
        │
        ▼
  React updates state → UI re-renders
```

### 3.5 Authentication Flow

```
              REGISTRATION                          LOGIN
  ┌───────────────────────┐         ┌───────────────────────────┐
  │ POST /api/auth/register│         │ POST /api/auth/login      │
  │ { name, email, pass } │         │ { email, password }       │
  └───────────┬───────────┘         └───────────┬───────────────┘
              │                                  │
              ▼                                  ▼
  bcrypt.hash(password, 10)          bcrypt.compare(pass, hash)
              │                                  │
              ▼                                  ▼
  User.create({...})                 Generate accessToken (15m)
              │                      Generate refreshToken (7d)
              ▼                                  │
  Return user data                   Set httpOnly cookie
              │                      Return { accessToken, user }
              ▼                                  │
  Redirect to /login                 Store in localStorage + Zustand
                                     Redirect to /dashboard

              TOKEN REFRESH
  ┌─────────────────────────────┐
  │ Axios 401 interceptor fires │
  │ POST /api/auth/refresh      │
  │ (httpOnly cookie sent auto) │
  └──────────────┬──────────────┘
                 │
                 ▼
  Verify refresh token → Issue new accessToken
  Update localStorage → Retry original request
```

---

## 4. Components/Concepts Used

### 4.1 Frontend Components & Concepts

| Component / Concept | Purpose in Application |
|---------------------|----------------------|
| **React 19** | Core UI library for building component-based single-page application. |
| **Vite** | Fast build tool and dev server with HMR (Hot Module Replacement) for rapid development. |
| **React Router v7** | Client-side routing with protected routes, layout nesting, and navigation. |
| **Bootstrap 5** | CSS framework providing responsive grid, typography, forms, cards, modals, tables, badges, progress bars, and alerts for consistent UI styling. |
| **React-Bootstrap** | React component wrappers for Bootstrap's JavaScript widgets (Modal, Dropdown, Nav, Form, Alert, Spinner, etc.) eliminating jQuery dependency. |
| **Zustand** | Lightweight state management for auth sessions, analytics data, and notifications — simpler alternative to Redux. |
| **Recharts** | React charting library used for BarChart (income vs. expense), PieChart (category donut), AreaChart (cash flow), and RadialBarChart (budget usage). |
| **Axios** | HTTP client with request/response interceptors for automatic JWT token attachment and 401 token refresh handling. |
| **React Icons** | Icon library providing Bootstrap icon set (BsGrid1X2Fill, BsReceipt, BsWallet2, etc.) for sidebar navigation and action buttons. |
| **jsPDF + html2canvas** | Client-side PDF generation by capturing HTML report content as canvas and converting to PDF document. |
| **canvas-confetti** | Celebratory confetti animation triggered on savings goal completion for positive UX. |
| **Protected Routes** | Route guard pattern using Zustand auth state to redirect unauthenticated users to the login page. |
| **Responsive Layout** | Sidebar + Topbar layout with mobile hamburger menu using CSS media queries and Bootstrap's responsive grid system. |

### 4.2 Backend Components & Concepts

| Component / Concept | Purpose in Application |
|---------------------|----------------------|
| **Node.js** | Server-side JavaScript runtime. |
| **Express 5** | Web framework handling RESTful API routing, middleware pipeline, and JSON request/response processing. |
| **MongoDB Atlas** | Cloud-hosted NoSQL database storing users, transactions, budgets, savings goals, and notifications. |
| **Mongoose ODM** | Object-Document Mapper providing schemas, validation, and query builder for MongoDB operations. |
| **JWT (jsonwebtoken)** | Stateless authentication with short-lived access tokens (15min) and long-lived refresh tokens (7 days). |
| **bcryptjs** | Password hashing library with salt rounds for secure credential storage. |
| **httpOnly Cookies** | Secure refresh token storage preventing XSS access to sensitive tokens. |
| **Helmet** | Security middleware setting various HTTP headers (Content-Security-Policy, X-Frame-Options, etc.). |
| **CORS** | Cross-Origin Resource Sharing configuration allowing the React client to communicate with the Express API. |
| **MongoDB Aggregation Pipeline** | Complex data aggregation ($match, $group, $sort) for analytics: monthly trends, category breakdowns, cash flow calculation, and smart insights generation. |
| **Middleware Pattern** | `authenticate` middleware verifies JWT on protected routes; `errorHandler` provides centralized error response formatting. |
| **MVC Architecture** | Models (Mongoose schemas), Controllers (business logic), Routes (endpoint mapping) separation for maintainability. |

### 4.3 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Authenticate and receive tokens |
| POST | `/api/auth/logout` | Clear refresh token |
| POST | `/api/auth/refresh` | Rotate access token |
| POST | `/api/auth/onboard` | Set income, currency, categories |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update profile settings |
| GET | `/api/transactions` | List transactions (paginated, filtered) |
| POST | `/api/transactions` | Create transaction |
| GET | `/api/transactions/:id` | Get single transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| DELETE | `/api/transactions/bulk` | Bulk delete transactions |
| GET | `/api/transactions/export/csv` | Export transactions as CSV |
| GET | `/api/budgets` | List budgets (filterable by month/year) |
| POST | `/api/budgets` | Create budget |
| PUT | `/api/budgets/:id` | Update budget |
| DELETE | `/api/budgets/:id` | Delete budget |
| GET | `/api/analytics/summary` | Dashboard summary cards data |
| GET | `/api/analytics/monthly-trend` | 6-month income vs. expense trend |
| GET | `/api/analytics/category-breakdown` | Spending by category (current month) |
| GET | `/api/analytics/cash-flow` | Running balance over time |
| GET | `/api/analytics/budget-usage` | Budget utilization percentages |
| GET | `/api/analytics/insights` | Smart spending pattern insights |
| GET | `/api/goals` | List savings goals |
| POST | `/api/goals` | Create savings goal |
| GET | `/api/goals/:id` | Get single goal |
| PUT | `/api/goals/:id` | Update goal |
| DELETE | `/api/goals/:id` | Delete goal |
| POST | `/api/goals/:id/contribute` | Add contribution to goal |
| GET | `/api/notifications` | List notifications |
| PUT | `/api/notifications/read-all` | Mark all notifications read |
| PUT | `/api/notifications/:id` | Mark single notification read |

---

## 5. Conclusion

Nexus Finance successfully demonstrates a full-stack MERN application that addresses real-world personal finance management needs. The project delivers:

- **A complete authentication system** with secure JWT-based access/refresh token rotation and an onboarding wizard that personalizes the experience from the first interaction.

- **Comprehensive financial tracking** through a transaction management system supporting full CRUD operations, categorization, tagging, filtering, pagination, and bulk actions — giving users complete control over their financial records.

- **Proactive budget management** with per-category monthly budgets that track spending in real time and trigger automatic notifications when spending limits are exceeded.

- **Goal-oriented savings** with a savings goal system that logs individual contributions, calculates projected completion dates based on contribution velocity, and celebrates milestone achievements with visual feedback.

- **Data-driven decision making** through a rich analytics dashboard powered by MongoDB aggregation pipelines, presenting six months of trend data across four distinct chart types (bar, donut, area, radial) alongside automatically generated smart insights that surface meaningful spending patterns.

- **Flexible reporting** with advanced multi-filter report generation and export capabilities in both CSV and PDF formats, supporting users who need to analyze or share their financial data externally.

- **Clean, responsive UI** built entirely with Bootstrap 5 and React-Bootstrap, ensuring the application works seamlessly across desktop and mobile devices with a consistent, professional look.

The three-person team structure (Backend Lead, Frontend Lead, Data/Analytics Lead) allowed for parallel development with clear ownership boundaries. The modular MVC architecture on the server and component-based architecture on the client ensure the codebase is maintainable and extensible for future enhancements such as recurring transaction automation, multi-currency conversion, or bank account integration.
