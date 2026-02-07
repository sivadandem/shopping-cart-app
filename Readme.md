# 🛒 Shopping Cart Application

A full-stack e-commerce web application built with Node.js, Express, MongoDB, and React.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Application Flow](#application-flow)
- [Screenshots](#screenshots)
- [Single-Device Session Management](#single-device-session-management)

---

## 📖 Overview

This is a basic e-commerce web application that allows users to:
- Create an account and login
- Browse available items
- Add items to cart
- Place orders
- View order history

The application implements **single-device session management**, ensuring a user can only be logged in from one device at a time.

---

## ✨ Features

### Backend
- ✅ User Registration & Authentication
- ✅ JWT-based Session Management
- ✅ Single-Device Login Enforcement
- ✅ Password Hashing with bcrypt
- ✅ RESTful API Design
- ✅ MongoDB Database Integration

### Frontend
- ✅ User Login/Register Interface
- ✅ Items Grid Display
- ✅ Add to Cart Functionality
- ✅ Cart Management
- ✅ Order Placement
- ✅ Order History View
- ✅ Responsive Design with Tailwind CSS

---

## 🛠️ Technologies Used

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Server Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| CORS | Cross-Origin Resource Sharing |
| dotenv | Environment Variables |

### Frontend
| Technology | Purpose |
|------------|---------|
| React | UI Library |
| Vite | Build Tool |
| Tailwind CSS v4 | Styling |
| Axios | HTTP Client |
| Lucide React | Icons |

---

## 📁 Project Structure
```
shopping-cart-app/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── .env
│   ├── package.json
│   ├── seed.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ItemList.jsx
│   │   │   ├── CartModal.jsx
│   │   │   ├── OrdersModal.jsx
│   │   │   ├── CheckoutModal.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── postcss.config.js
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or Atlas) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js)

---

## 🚀 Installation

### 1. Clone or Download the Project
```bash
cd shopping-cart-app
```

### 2. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file with the following content:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/shopping_cart_db
# JWT_SECRET=your_super_secret_key_change_this_in_production

# Seed the database with sample items
node seed.js
```

### 3. Frontend Setup
```bash
# Navigate to frontend folder
cd ../frontend

# Install dependencies
npm install
```

---

## ▶️ Running the Application

### Step 1: Start MongoDB
Make sure MongoDB is running on your system.
```bash
mongod
```

### Step 2: Start Backend Server
Open a terminal and run:
```bash
cd backend
npm run dev
```

Backend will run on: `http://localhost:5000`

### Step 3: Start Frontend Server
Open another terminal and run:
```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

### Step 4: Open Browser
Navigate to: `http://localhost:5173`

---

## 📡 API Endpoints

### User Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users` | Register new user | No |
| GET | `/users` | List all users | No |
| POST | `/users/login` | Login user | No |
| POST | `/users/logout` | Logout user | Yes |
| GET | `/users/me` | Get current user | Yes |

### Item Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/items` | Create new item | No |
| GET | `/items` | List all items | No |
| GET | `/items/:id` | Get single item | No |

### Cart Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/carts` | Add item to cart | Yes |
| GET | `/carts` | List all carts | No |
| GET | `/carts/my-cart` | Get user's cart | Yes |
| DELETE | `/carts/my-cart/items/:itemId` | Remove item from cart | Yes |

### Order Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Create order from cart | Yes |
| GET | `/orders` | List all orders | No |
| GET | `/orders/my-orders` | Get user's orders | Yes |

---

## 🔄 Application Flow
```
1. User Registration
   └── POST /users (Create account)

2. User Login
   └── POST /users/login (Get JWT token)
   └── Token stored in localStorage and user's DB record

3. Browse Items
   └── GET /items (Display all items)

4. Add to Cart
   └── POST /carts (Add item with user's token)

5. View Cart
   └── GET /carts/my-cart (Get user's cart)

6. Place Order
   └── POST /orders (Convert cart to order)
   └── Cart is cleared after order

7. View Order History
   └── GET /orders/my-orders (Get user's orders)

8. Logout
   └── POST /users/logout (Clear token from DB)
```

---

## 📸 Screenshots

### Login Page
- Blue/purple gradient background
- Username and password fields
- Sign In / Register toggle

### Items Page
- Grid layout of available items
- Item name, description, price, and image
- "Add to Cart" button on each item

### Cart Modal
- Slide-in panel from right
- List of cart items
- "Proceed to Checkout" button

### Order History
- List of placed orders
- Order ID, date, items, and total amount
- Order status indicator

---

## 🔐 Single-Device Session Management

This application ensures a user can only be logged in from one device at a time.

### How it works:

**On Login:**
- JWT token is generated
- Token is stored in the user's database record
- If token already exists → Login denied

**On Protected Routes:**
- Token from request is compared with stored token
- If mismatch → Access denied

**On Logout:**
- Token is removed from database
- User can login again (same or different device)

**Error Message:**
```
"You cannot login on another device."
```

---

## 🧪 Testing the Application

### Test User Flow:
1. Register a new account
2. Login with credentials
3. Browse available items
4. Add items to cart
5. View cart contents
6. Checkout and place order
7. View order history
8. Logout

### Test Single-Device Login:
1. Login on Browser 1
2. Try to login on Browser 2 (Incognito)
3. Should see "You cannot login on another device" error

---

## 📝 Environment Variables

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shopping_cart_db
JWT_SECRET=your_super_secret_key_change_this_in_production
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Author

Built as part of ABCDE Ventures Assignment.

---

## 🆘 Support

If you encounter any issues:

- Make sure MongoDB is running
- Check if all dependencies are installed
- Verify `.env` file exists with correct values
- Check console for error messages

**Happy Shopping! 🛒**