# Backend Contribution Summary – Hieu Le

This document outlines my **full-stack backend contributions** to the SarangXanh project — a Vietnamese non-profit organization. I was responsible for designing, building, and securing the backend architecture. All backend logic was written and fully understood by me.

---

## Technologies Used

- **Node.js & Express** – Server setup and route handling  
- **MySQL** – Relational database using `mysql2/promise`  
- **JWT** – Secure token-based authentication  
- **bcrypt** – Password hashing and credential safety  
- **CORS** – Cross-origin resource sharing for client access  
- **dotenv** – Protecting secrets and environment variables  
- **Postman** – API testing during development  
- **GitHub Desktop** – Version control and branch collaboration  

---

## Key Backend Contributions

### 1. Authentication & Authorization
- Created **JWT-based login & session system**
- Implemented `verifyUser.js` middleware to guard admin-only routes
- Used **bcrypt** to hash passwords securely
- Designed safe registration & login flow, using access token validation

### 2. Core Backend Setup
- Built Express server from scratch (`Server.js`)
- Configured middlewares: CORS, JSON parser, custom error handling
- Structured backend into modular layers:
  - `Routes/` for endpoints
  - `Controllers/` for request logic
  - `Models/` for SQL abstraction
  - `Middleware/` for auth and protection

### 3. Database & API Logic
- Configured DB with `.env` variables (secured)
- Used `mysql2/promise` and prepared statements to avoid injection
- Built REST APIs for:
  - Events (create, edit, delete)
  - Products (admin-controlled)
  - Posts/Blogs
  - Admin login

### 4. Admin Dashboard Integration
- Backend powers a React-based dashboard
- APIs enable admin users to:
  - Create, update, and delete content
  - Manage eco-friendly products
  - Moderate site blog/posts
  - Monitor user activity and changes

### 5. Testing & Git Collaboration
- Used **Postman** to test endpoints and debug response errors
- Created a dedicated branch `hieu` to push backend updates
- Documented route behavior and coordinated merge requests

---

## Backend Logic Flow

### General API Request Flow

```
Client Request (Frontend)
        ↓
Route File (e.g., /api/products)
        ↓
verifyUser Middleware (for protected routes)
        ↓
Controller (e.g., productController.js)
        ↓
Model (SQL Query - productModel.js)
        ↓
MySQL Database (via mysql2/promise)
        ↓
Result sent back → Controller → Response to Client
```

### Admin Login Flow

```
POST /api/admin/login
→ Checks email & password
→ bcrypt compares password
→ If valid: sign JWT
→ Return token to client
→ Token saved in frontend (localStorage)
→ All future admin requests send token in headers
```

### CRUD Event Logic

```
/api → /http://localhost:8081(in Vite config)
GET /api/events → Return all events
POST /api/events → Create new (admin only)
PUT /api/events/:id → Edit event by ID (admin only)
DELETE /api/events/:id → Delete by ID (admin only)
```

---

## Backend File Ownership

| File/Folder              | Status                     |
|--------------------------|----------------------------|
| `Server.js`              | ✅ Fully written by me      |
| `Middleware/verifyUser`  | ✅ Auth route protection    |
| `Config/db.js`           | ✅ MySQL connection logic   |
| `.env`                   | ✅ Secured DB & token keys  |
| `Routes/`                | ✅ Full route structure     |
| `Controllers/`           | ✅ All request handling     |
| `Models/`                | ✅ SQL abstraction layer    |
| `Postman Collection`     | ✅ Created & used           |
| Admin API integration    | ✅ Fully implemented        |

---

## Backend Directory Structure

```bash
/backend
├── Config/
│   └── db.js              # MySQL connection via dotenv
├── Middleware/
│   └── verifyUser.js      # JWT authentication middleware
├── Routes/
│   ├── adminRoute.js      # Auth and dashboard routes
│   ├── eventRoute.js      # Event management
│   ├── productRoute.js    # Product control
├── Controllers/
│   └── Logic for each route group
├── Models/
│   └── SQL logic using mysql2
├── Server.js              # Express app with all routes connected
└── .env                   # Not committed
```

---

## Admin Dashboard Structure (Frontend Support)

```bash
/Admin
├── Login.jsx              # Admin login form (JWT auth)
├── Register.jsx           # Admin registration
├── Dashboard/
│   ├── SideBar.jsx        # Left-side navigation
│   ├── Dashboard.jsx      # Routing & layout
│   └── Pages/
│       ├── GalleryPage.jsx     # Upload/edit event media
│       ├── MembersPage.jsx     # Admin view of team
│       ├── DashboardPage.jsx   # Overview metrics
│       └── DataPage.jsx        # Table data (events/products/posts)
```

---

## Notes

> I wrote all backend code by myself and with the helps from AI. I fully understood, modified, and integrated every line of code into the project myself.
> From JWT authentication to database connection, my work represents **secure, modular, and scalable architecture**.  
> I take full ownership of the backend logic and its performance, integration, and security.

---

# Frontend Contribution Summary – Hieu Le

This section outlines my contributions to the frontend of the SarangXanh full-stack project, specifically focusing on the homepage and routing architecture.

---

## Technologies Used

- **ReactJS** for component-based UI development
- **React Router v6** for client-side routing
- **JSX + Functional Components** for modular structure
- **Context API** for auth state management and protected routes

---

## Key Contributions

### 1. Homepage + Navbar UI & Component Architecture
I fully built and implemented the homepage, which includes:
- `Banner.jsx` – Hero section with intro visuals
- `AboutUs.jsx` – Our mission and team background
- `Effect.jsx` – Visual effects representing impact
- `Slider.jsx` – Interactive carousel showcasing initiatives
- `Stats.jsx` – Animated statistics on environmental impact
- `Tutorial.jsx` – Step-by-step guide to get involved
- `FAQSection.jsx` – Embedded FAQ section on homepage
- `Merch.jsx` – Product preview of eco-friendly merchandise
- `Navbar.jsx` – Responsive navbar with social links and branding

All homepage components were styled and integrated manually to reflect SarangXanh’s identity.

### 2. Routing System & Page Structure
I designed the entire frontend routing architecture via `App.jsx`:
- Set up **React Router v6** for seamless navigation
- Handled all route definitions with `Routes` and `Route` components
- Used `useLocation()` to dynamically hide/show `Navbar` and `Footer`

### 3. Admin Route Protection
- Created a `ProtectedRoute.jsx` wrapper using `AuthContext` to control access
- Admin dashboard is only accessible after JWT auth validation
- Redirects unauthenticated users to the login page
- Nested dashboard routes support:
  - `/admin/dashboard/data`
  - `/admin/dashboard/gallery`
  - `/admin/dashboard/members`
  - `/admin/dashboard/dashboard`

### 4. Conditional Layout Logic
- `Navbar` and `Footer` are hidden from admin/dashboard routes
- Ensures clean and distraction-free admin experience

---

## Logic Flow

```txt
1. App.jsx loads -> checks URL using useLocation()
2. If route is under "/admin/dashboard" -> hide Navbar and Footer
3. Routes wrapped with ProtectedRoute:
   - If `auth` is true → render component
   - If `auth` is false and not loading → redirect to /login
4. If logged in, redirect from /login to /admin/dashboard
5. Nested routes handled within AdminDashboard component
```

---

## Notes
> While some code was assisted by AI tools, I thoroughly understood, customized, and manually integrated all routing, layout logic, and homepage UI to ensure a smooth, secure, and user-centered frontend experience.

---

## Author

- **Name**: Hieu Le  
- **Role**: Full-Stack Developer  
- **Date**: August 2025  
- **Location**: Hanoi, Vietnam  
- **Ownership**: Backend logic (with AI-assisted integration), Admin API system, Homepage UI & Website Routing 
- **Branch Used**: `hieu`  
- **Debugging Tools**: Postman, browser dev tools, console logs, MDN, StackOverflow

