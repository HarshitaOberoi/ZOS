# Zorvyn Finance Dashboard

> A role-based finance dashboard with analytics, secure access control, and streamlined record management.

## Project Overview

Zorvyn is a full-stack finance dashboard built to demonstrate how a modern analytics system can combine a polished frontend experience with a clean backend architecture. The platform helps teams track income and expenses, review key business metrics, and manage financial records through a role-aware workflow.

The system is designed around real-world patterns that matter in production applications: JWT authentication, role-based access control, validation at the API boundary, a service layer for business logic, and a dashboard that turns raw transaction data into usable insight. It is relevant for admin panels, internal tools, finance reporting products, and portfolio projects that need to show both technical structure and practical product thinking.

## Features

### Core Capabilities

- Secure authentication with registration, login, token-based sessions, and session restoration
- Role-based access control for `VIEWER`, `ANALYST`, and `ADMIN`
- Financial record creation, editing, viewing, and deletion based on role permissions
- Dashboard analytics for income, expenses, balance tracking, and category insights
- User administration for role and account status management

### Records Workspace

- Create and edit finance records through modal forms
- Filter records by type, category, and date range
- Search records by category, notes, and type
- Sort records by date, amount, and category
- Browse records through paginated frontend views

### User Experience

- Responsive React interface built for desktop and mobile use
- Loading states, empty states, and feedback toasts
- Protected routes and role-aware navigation
- Production-style frontend build served by the Express server

## System Architecture

```mermaid
flowchart LR
    A[React Frontend<br/>Vite + Tailwind] --> B[Express API]
    B --> C[Routes]
    C --> D[Controllers]
    D --> E[Services]
    E --> F[Prisma ORM]
    F --> G[(PostgreSQL Database)]
```

### Request Flow

1. The frontend sends authenticated requests to the API.
2. Express routes map requests to the correct controller.
3. Controllers validate request intent and delegate business logic.
4. Services apply rules for records, users, and analytics.
5. Prisma reads from and writes to the SQLite database.

## Role-Based Access Control Flow

```mermaid
flowchart TD
    A[User Logs In] --> B[JWT Issued]
    B --> C[Authenticated Request]
    C --> D[Auth Middleware Verifies Token]
    D --> E{User Active?}
    E -- No --> F[Reject Request]
    E -- Yes --> G{Required Role Met?}
    G -- No --> H[403 Forbidden]
    G -- Yes --> I[Controller Executes Action]
```

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- React Hook Form
- Zod
- Recharts
- Framer Motion
- Sonner
- Lucide React

### Backend

- Node.js
- Express
- JWT authentication
- Zod validation
- Express rate limiting

### Database

- PostgreSQL
- Prisma ORM

### Tools

- Nodemon
- Prisma CLI
- npm
- Mermaid.js for documentation diagrams

## Project Structure

```text
zorvyn/
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |   `-- AuthContext.jsx
|   |   |-- components/
|   |   |   |-- charts/
|   |   |   |-- dashboard/
|   |   |   |-- forms/
|   |   |   |-- layout/
|   |   |   |-- records/
|   |   |   `-- ui/
|   |   |-- data/
|   |   |-- hooks/
|   |   |-- lib/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- styles/
|   |   |-- types/
|   |   |-- App.jsx
|   |   `-- main.jsx
|-- prisma/
|   |-- schema.prisma
|   `-- seed.js
|-- src/
|   |-- config/
|   |-- controllers/
|   |-- middlewares/
|   |-- routes/
|   |-- services/
|   |-- utils/
|   |-- validations/
|   `-- index.js
|-- dist/
|-- package.json
`-- README.md
```

## API Overview

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Handles account creation, login, and session restoration for authenticated users.

### Users

- `GET /api/users`
- `PATCH /api/users/:id`

Supports admin-facing user listing and user role or status updates.

### Records

- `GET /api/records`
- `GET /api/records/:id`
- `POST /api/records`
- `PUT /api/records/:id`
- `DELETE /api/records/:id`

Supports financial record retrieval and mutation with role-aware authorization rules.

### Dashboard

- `GET /api/dashboard/summary`

Returns computed analytics such as totals, balances, recent transactions, and monthly summaries.

## Dashboard Analytics Explained

The dashboard summary is computed from the authenticated user's active financial records.

- Total income: the sum of all records where `type = INCOME`
- Total expenses: the sum of all records where `type = EXPENSE`
- Net balance: `total income - total expenses`
- Category breakdown: grouped totals per category for income and expense buckets
- Recent transactions: the five most recent records sorted by date
- Monthly summary: grouped monthly totals for income and expenses, plus monthly net

This makes the dashboard useful for understanding performance trends, spending patterns, and high-level financial health without manually reviewing every transaction.

## Role Permissions Table

| Capability | Viewer | Analyst | Admin |
| --- | --- | --- | --- |
| Log in and view own dashboard | Yes | Yes | Yes |
| View financial records | Yes | Yes | Yes |
| Filter and search records | Yes | Yes | Yes |
| Create new records | No | Yes | Yes |
| Edit existing records | No | Yes | Yes |
| Delete records | No | No | Yes |
| View dashboard analytics | Yes | Yes | Yes |
| View users list | No | No | Yes |
| Update user role/status | No | No | Yes |

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd zorvyn
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

PowerShell alternative:

```powershell
Copy-Item .env.example .env
```

If needed, you can also create `.env` manually using the sample below.

### 4. Prepare the database

Ensure your `DATABASE_URL` in `.env` points to your PostgreSQL database. Then, apply migrations and seed the database:

```bash
npx prisma migrate deploy
npx prisma db seed
```

### 5. Run the backend and frontend in development

```bash
npm run dev
```

This starts:

- Backend API on `http://localhost:3000`
- Frontend app on `http://localhost:5173`

### 6. Open the application

```text
http://localhost:5173/login
```

### Optional: run only the backend

```bash
npm run dev:server
```

### Optional: create a production build

```bash
npm run build
npm start
```

When a frontend build exists, the Express server serves the built dashboard from `dist/`.

## Environment Variables

Use a root-level `.env` file like this:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
PORT=3000
JWT_SECRET="replace-with-a-secure-secret"
VITE_API_URL="http://localhost:3000"
```

### Variable Notes

- `DATABASE_URL`: Prisma connection string for PostgreSQL
- `PORT`: port used by the Express API
- `JWT_SECRET`: secret used to sign and verify JWT tokens
- `VITE_API_URL`: frontend target for API requests

## Demo Credentials

Seeded demo users from `prisma/seed.js`:

- `admin@zorvyn.io` / `Admin@123`
- `analyst@zorvyn.io` / `Analyst@123`
- `viewer@zorvyn.io` / `Viewer@123`

## Screenshots / UI Preview

Add screenshots in this section to make the project easier to evaluate visually.

- Login screen: `Add screenshot here`
- Dashboard overview: `Add screenshot here`
- Records workspace: `Add screenshot here`
- Admin panel: `Add screenshot here`

## Future Enhancements

- Server-side pagination for large record collections
- Global search across records, users, and analytics
- Export to CSV or PDF
- Notification system for account and finance events
- Dark mode and theme personalization
- Audit logs for sensitive admin actions
- Advanced chart filters and comparison ranges
- Multi-user organization support

## Design Decisions & Assumptions

- RBAC is enforced in both the UI and API, but the API remains the source of truth
- JWT authentication is used to keep the client stateless and simple for SPA workflows
- A service layer is used so business rules stay separate from controllers and routing
- Prisma is used to simplify database access and keep data operations structured
- PostgreSQL is used for robust data management and cloud deployment
- Dashboard analytics are computed per authenticated user, which keeps data isolated
- Admins currently manage users and records within the same application, but records are still scoped to the authenticated user in the present data model

## Conclusion

Zorvyn demonstrates more than a visually polished dashboard. It shows clean layering from frontend to database, practical role-based access control, API validation, analytics computation, and a structure that can grow into a larger real-world system. As a project, it highlights architectural clarity, scalability-minded thinking, and an understanding of how product experience and backend discipline work together.

## Deployment

This application is configured for deployment on both Render and Vercel.

### Render

Render is used for hosting the PostgreSQL database and can also host the full-stack application.

**Build Command**: `npm run build`
**Start Command**: `npm start`

**Environment Variables**:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `JWT_SECRET`: A secure secret for JWT token signing.

### Vercel

Vercel is used for hosting the full-stack application (frontend and backend serverless functions).

**`vercel.json` Configuration**:
The `vercel.json` file in the project root configures Vercel to serve the frontend and route API requests to the Node.js backend as a serverless function.

```json
{
  "version": 2,
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.js" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Environment Variables**:
- `DATABASE_URL`: Your PostgreSQL connection string (same as Render).
- `JWT_SECRET`: A secure secret for JWT token signing (same as Render).
- `NODE_ENV`: Set to `production`.

**Important**: Ensure `DATABASE_URL` and `JWT_SECRET` are identical on both Render and Vercel if you intend to use the same database and allow seamless user sessions across deployments.
