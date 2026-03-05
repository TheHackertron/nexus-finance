# Nexus Finance — Server

REST API backend for the Nexus Finance personal finance dashboard, built with Express and MongoDB.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB Atlas (Mongoose 9 ODM)
- **Auth:** JWT access tokens + httpOnly refresh token cookies, bcryptjs
- **Security:** Helmet, CORS, express-rate-limit

## Project Structure

```
nexus-finance-server/
├── index.js                 # App entry — middleware, routes, DB connection
├── middleware/
│   ├── authenticate.js      # JWT Bearer token verification
│   └── errorHandler.js      # Global error handler
├── models/
│   ├── User.js              # User profile, credentials, preferences
│   ├── Transaction.js       # Income/expense records
│   ├── Budget.js            # Monthly category budgets
│   ├── Notification.js      # In-app alerts (budget, goal, general)
│   └── SavingsGoal.js       # Savings targets with contribution log
├── controllers/
│   ├── auth.controller.js           # Register, login, logout, refresh, onboard, profile
│   ├── transaction.controller.js    # CRUD, bulk delete, CSV export
│   ├── budget.controller.js         # CRUD, overspend detection + notification
│   ├── notification.controller.js   # List, mark read, mark all read
│   ├── analytics.controller.js      # Aggregation pipelines for dashboard
│   └── goals.controller.js          # CRUD, contribution logging, completion
└── routes/
    ├── auth.routes.js
    ├── transaction.routes.js
    ├── budget.routes.js
    ├── notification.routes.js
    ├── analytics.routes.js
    └── goals.routes.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)

### Installation

```bash
cd nexus-finance-server
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/nexus-finance
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLIENT_URL=http://localhost:5173
```

### Run Development Server

```bash
npm run dev
```

The server starts at `http://localhost:5000`. The test route `GET /` returns:

```json
{ "success": true, "message": "Nexus Finance Server is running!" }
```

## API Reference

All protected routes require an `Authorization: Bearer <token>` header.

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Create new user account |
| POST | `/login` | No | Authenticate, returns access token + refresh cookie |
| POST | `/logout` | No | Clear refresh token cookie |
| POST | `/refresh` | No | Rotate access token via refresh cookie |
| POST | `/onboard` | Yes | Set income, currency, expense categories |
| GET | `/profile` | Yes | Get current user profile |
| PUT | `/profile` | Yes | Update name, currency, categories |

### Transactions (`/api/transactions`)

All routes require authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List transactions (supports `page`, `limit`, `type`, `category`, `startDate`, `endDate` query params) |
| POST | `/` | Create a transaction |
| GET | `/export/csv` | Download all transactions as CSV file |
| GET | `/:id` | Get single transaction |
| PUT | `/:id` | Update a transaction |
| DELETE | `/:id` | Delete a transaction |
| DELETE | `/bulk` | Bulk delete (body: `{ ids: [...] }`) |

### Budgets (`/api/budgets`)

All routes require authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List budgets (supports `month`, `year` query params) |
| POST | `/` | Create a budget |
| PUT | `/:id` | Update a budget |
| DELETE | `/:id` | Delete a budget |

### Analytics (`/api/analytics`)

All routes require authentication. These endpoints use MongoDB aggregation pipelines.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/summary` | Dashboard summary — total balance, monthly income/expense, net savings, savings totals |
| GET | `/monthly-trend` | Last 6 months income vs. expense grouped by month |
| GET | `/category-breakdown` | Current month spending grouped by category (supports `month`, `year` params) |
| GET | `/cash-flow` | Running balance over time (weekly aggregation, last 6 months) |
| GET | `/budget-usage` | Budget utilization percentage per category (supports `month`, `year` params) |
| GET | `/insights` | Smart insights — spending trend, top category, savings rate, budget alerts |

### Savings Goals (`/api/goals`)

All routes require authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all savings goals |
| POST | `/` | Create a savings goal |
| GET | `/:id` | Get single goal |
| PUT | `/:id` | Update a goal |
| DELETE | `/:id` | Delete a goal |
| POST | `/:id/contribute` | Add contribution (body: `{ amount, note }`) — triggers completion notification if target reached |

### Notifications (`/api/notifications`)

All routes require authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all notifications (sorted newest first) |
| PUT | `/read-all` | Mark all notifications as read |
| PUT | `/:id` | Mark single notification as read |

## Data Models

### User
`name`, `email`, `password` (hashed), `avatar`, `currency` (default INR), `income`, `categories[]`, `refreshToken`

### Transaction
`user` (ref), `title`, `amount`, `type` (income/expense), `category`, `date`, `notes`, `tags[]`, `isRecurring`, `recurringInterval`, `receipt`

### Budget
`user` (ref), `category`, `amount`, `spent`, `month`, `year`, `notified`

### SavingsGoal
`user` (ref), `title`, `targetAmount`, `currentAmount`, `deadline`, `category`, `contributions[]` (amount, date, note), `isCompleted`, `completedAt`

### Notification
`user` (ref), `message`, `type` (budget/goal/general), `isRead`

## Dependencies

| Package | Purpose |
|---------|---------|
| express | Web framework |
| mongoose | MongoDB ODM |
| jsonwebtoken | JWT token generation and verification |
| bcryptjs | Password hashing |
| cookie-parser | Parse httpOnly refresh token cookies |
| cors | Cross-origin request handling |
| helmet | HTTP security headers |
| express-rate-limit | API rate limiting |
| dotenv | Environment variable loading |
| cloudinary | Image upload (avatar, receipts) |
| multer | Multipart form data parsing |
| nodemon (dev) | Auto-restart on file changes |
