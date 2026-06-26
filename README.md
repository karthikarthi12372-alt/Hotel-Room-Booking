# LuxeStay - Hotel Room Booking System (MERN Stack)

LuxeStay is a full-featured, responsive, and secure hotel room booking application built on the MERN stack (MongoDB, Express.js, React.js + Vite, and Node.js). 

Designed for premium accommodations, LuxeStay delivers an interactive and responsive user experience. It supports JWT authentication, Role-Based Access Control, searching and filtering properties, booking and cancellation pipelines, and an administrative panel for site operators.

## Key Features

### Authentication & Authorization
* **Secure Registration & Login**: Custom password hashing and encryption via Bcrypt.js.
* **Role-Based Access Control (RBAC)**: Distinct permissions for **User** and **Admin** profiles.
* **Session Persistence**: JWT-based session tokens attached dynamically to API requests.

### Client Capabilities
* **Hotel Search & Explore**: Discover hotels by name or city using the search bar (case-insensitive).
* **Room Filtering**: Filter hotel accommodations dynamically by type (Single, Double, Suite, Deluxe), capacity (guests limit), and max price per night.
* **Interactive Checkout**: Secure checkout with check-in/check-out dates. Automatically checks for double-booking conflicts and calculates price totals.
* **User Dashboard**: Review reservation history, check status indicators (Booked, Completed, Cancelled), and cancel bookings.
* **Profile Management**: Update user profile information (Name, Email, Phone, Password).

### Administrative Capabilities
* **Gross Metrics Analytics**: Check performance stats (Gross Revenue, Total Bookings, Active Properties, Users).
* **Hotel Property CRUD**: Create, edit, and delete hotel property listings (including descriptions, locations, rating, amenities, and image listings).
* **Room Listing CRUD**: Add, edit, and delete rooms for hotels (room number, type, capacity, pricing, availability and descriptors).
* **Reservation Logs Control**: View all platform reservations, update reservation statuses (Booked, Completed, Cancelled), and delete old logs.
* **User Management Panel**: Review all registered accounts, toggle admin status privileges, and delete user profiles.

---

## Folder Structure

```text
hotel-room-booking/
├── backend/
│   ├── config/             # DB Connection Config
│   ├── controllers/        # Express Route Handlers (Logic)
│   ├── middleware/         # Auth Filters & Error Handling
│   ├── models/             # Mongoose DB Schemas
│   ├── routes/             # REST Endpoints mapping
│   ├── index.js            # Server entry point
│   ├── seeder.js           # Seed script for mockup properties
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Nav, Footer, Cards and protection layouts
│   │   ├── context/        # Global Auth State context
│   │   ├── pages/          # Client and Admin screens
│   │   ├── services/       # Axios API interceptor configurations
│   │   ├── App.jsx         # Routes mapping
│   │   ├── index.css       # Tailwind & styling design system
│   │   └── main.jsx
│   ├── index.html          # SEO viewport and titles
│   └── package.json
└── README.md
```

---

## Backend REST API Schema

### Authentication
* `POST /api/auth/register` - Create user account
* `POST /api/auth/login` - Login user and return JWT session token

### Hotel Properties
* `GET /api/hotels` - Retrieve all hotels (supports `?search=` query parameter)
* `GET /api/hotels/:id` - Retrieve specific hotel profile details
* `POST /api/hotels` - Add a new hotel (Admin only)
* `PUT /api/hotels/:id` - Update hotel specifications (Admin only)
* `DELETE /api/hotels/:id` - Delete hotel & all its associated rooms (Admin only)

### Rooms
* `GET /api/rooms/hotel/:hotelId` - List rooms for a hotel (supports `?type=`, `?capacity=`, and `?maxPrice=` filters)
* `GET /api/rooms/:id` - Retrieve room specifications
* `POST /api/rooms` - Add room to a hotel (Admin only)
* `PUT /api/rooms/:id` - Edit room configuration & manual availability toggle (Admin only)
* `DELETE /api/rooms/:id` - Delete room profile (Admin only)

### Bookings
* `GET /api/bookings/my-bookings` - Fetch logged-in user's bookings history
* `POST /api/bookings` - Submit booking (Validates date parameters, calculates pricing, and checks for double bookings)
* `PUT /api/bookings/:id/cancel` - Cancel booking reservation (User or Admin)
* `GET /api/bookings` - List all reservations (Admin only)
* `PUT /api/bookings/:id` - Update status (`Booked`, `Completed`, `Cancelled`) (Admin only)
* `DELETE /api/bookings/:id` - Delete reservation log (Admin only)

### Users Management (Admin Only)
* `GET /api/users` - Fetch list of user accounts
* `PUT /api/users/:id/role` - Toggle Admin privilege role
* `DELETE /api/users/:id` - Delete user account

---

## Installation & Setup Guide

### Prerequisites
1. **Node.js** (v16+)
2. **MongoDB** (Local instance running on `127.0.0.1:27017` or MongoDB Atlas URI)

### Backend Setup
1. Open a terminal inside the `/backend` folder:
   ```bash
   cd backend
   ```
2. Create a `.env` configuration file based on `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/hotel-booking
   JWT_SECRET=supersecretjwtkey12345!
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Seed the database with mock properties, rooms, and test credentials:
   ```bash
   node seeder.js
   ```
5. Start backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open a terminal inside the `/frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start frontend dev server:
   ```bash
   npm run dev
   ```
4. Access the web app at `http://localhost:5173/` inside your browser.

### Seed Login Credentials
* **Standard User**:
  - Email: `john@gmail.com`
  - Password: `password123`
* **Admin User**:
  - Email: `admin@hotel.com`
  - Password: `password123`

---

## Deployment Instructions

### Backend (Render / Heroku)
1. Set up a MongoDB Atlas Cluster and get your DB URI connection string.
2. Push your project code to a GitHub repository.
3. Link your repository to Render or Heroku:
   * Select Node.js environment.
   * Root directory: `backend`
   * Build command: `npm install`
   * Start command: `node index.js`
4. Configure environment variables (`MONGODB_URI`, `JWT_SECRET`, `PORT`).

### Frontend (Netlify / Vercel)
1. Open Vercel or Netlify.
2. Link your GitHub repository.
3. Configure the build parameters:
   * Root directory: `frontend`
   * Build command: `npm run build`
   * Output directory: `dist`
4. Update the Base URL endpoint inside `frontend/src/services/api.js` to target your deployed backend server domain.
5. Deploy.
