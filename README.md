# 🛍️ ChicBoutique: Full-Stack Fashion E-commerce Platform

Welcome to **ChicBoutique**, a comprehensive full-stack e-commerce platform designed for fashion retailers. This project offers a seamless shopping experience for customers and a powerful administration panel for efficient business management. From trendy apparel browsing to secure order processing and detailed analytics, ChicBoutique provides all the tools needed to run a modern online fashion store.

## ✨ Highlights & Features

ChicBoutique is packed with functionalities to create a dynamic e-commerce environment:

*   **👗 Product Catalog Management**: Effortlessly add, update, and categorize a wide range of fashion products, complete with rich media (images, videos).
*   **🛒 Intuitive Shopping Cart**: A robust cart system allowing users to add, remove, and manage items before checkout.
*   **💳 Secure Checkout & Payments**: Streamlined checkout flow with integrated payment processing capabilities.
*   **📦 Order Tracking & History**: Customers can track their orders in real-time and view their complete purchase history.
*   **👤 User Authentication & Profiles**: Secure sign-up, login, and comprehensive user profiles for personalized experiences.
*   **👩‍💻 Admin Dashboard**: A dedicated interface for administrators to manage products, orders, customers, coupons, and monitor sales analytics.
*   **📈 Sales Analytics & Reporting**: Visual dashboards (`BarChartBox.jsx`, `LineChartBox.jsx`) to monitor key performance indicators (KPIs) like sales, revenue, and inventory.
*   **💰 Coupon & Discount System**: Create and manage promotional coupons to attract and retain customers.
*   **💬 Customer Support**: Features to manage customer inquiries and support requests.
*   **🔒 Role-Based Access Control**: Differentiate between customer and administrator access with protected routes.
*   **🖼️ Cloudinary Integration**: Efficient image and media storage and delivery for product visuals.
*   **📧 Email Notifications**: Automated emails for order confirmations, shipping updates, and more (`authEmail.js`).
*   **📱 Responsive Design**: Built with React and Tailwind CSS for a modern and adaptable user interface.

## ⚙️ Tech Stack

ChicBoutique leverages a modern technology stack to deliver a robust and scalable application:

*   **Frontend**:
    *   **React.js**: A powerful JavaScript library for building user interfaces.
    *   **Vite**: A fast build tool for modern web projects.
    *   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
    *   **Axios**: For making HTTP requests to the backend API.
    *   **Zustand**: (Inferred from `authStore.js`, `cartStore.js`, `orderStore.js`, `productStore.js`, `profileStore.js`) A small, fast, and scalable state-management solution.
*   **Backend**:
    *   **Node.js**: A JavaScript runtime for server-side logic.
    *   **Express.js**: A fast, unopinionated, minimalist web framework for Node.js.
    *   **MongoDB**: A NoSQL document database for flexible data storage.
    *   **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
    *   **JSON Web Tokens (JWT)**: For secure user authentication and authorization.
    *   **Bcrypt.js**: For hashing passwords securely.
    *   **Cloudinary**: For cloud-based image and video management.
    *   **Nodemailer**: (Inferred from `authEmail.js`) For sending emails.

## 📂 Project Structure

The project is organized into distinct frontend and backend directories, along with shared assets and configurations.

```
.
├── public/                 # Static assets like favicon, logo
├── src/
│   ├── api/                # Axios instance for API calls
│   ├── assets/             # Images, videos, other media
│   ├── auth/               # Authentication related files (store, controller, model, route, validator)
│   ├── components/         # Reusable UI components (Footer, Header, Navbar, Sidebar, StatsCard, etc.)
│   ├── config/             # Database, Cloudinary, Category configurations
│   ├── controllers/        # Backend logic for various modules (auth, cart, order, product, payment, profile)
│   ├── models/             # Mongoose schemas for database collections (auth, cart, category, coupon, order, product, profile, review, securityKey, subCategory)
│   ├── middleware/         # Express middleware for authentication, roles, uploads, validation
│   ├── pages/              # Frontend pages (Home, Dashboard, Productdetailpage, Cartpage, Checkoutpage, etc.)
│   ├── routes/             # Backend API routes
│   ├── store/              # Zustand stores for global state management
│   ├── styles/             # Global CSS files
│   ├── utils/              # Utility functions (jwt, bcrypt, apiError, apiResponse, exportCsv, generateInvoice, chartColors, userCookies, etc.)
│   └── App.jsx             # Main React application component
├── .env.example            # Example environment variables
├── package.json            # Project dependencies and scripts
├── app.js                  # Main backend server entry point
├── main.jsx                # Main frontend entry point
└── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite configuration
└── ...                     # Other configuration files (.postcss.config.js, .eslint.config.js, bervo.config.js)
```
*Note: This structure is inferred from the file listing and common project conventions.*

## 🚀 Installation

To get ChicBoutique up and running on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install Frontend Dependencies:**
    Navigate to the project root (where `package.json` is located) and install:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Install Backend Dependencies:**
    The backend dependencies are typically managed within the same `package.json` for a monorepo-style setup, so the previous `npm install` should cover it.

## 🛠️ Usage

### ⚙️ Environment Variables

Create a `.env` file in the root directory of the project based on `.env.example`.
You'll need to fill in the following:

```env
PORT=8000
MONGO_URI="your_mongodb_connection_string"
JWT_SECRET="a_very_secret_string"
JWT_EXPIRATION="7d" # e.g., '1h', '7d'

CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# Optional: For email services (if configured)
EMAIL_SERVICE_HOST="smtp.example.com"
EMAIL_SERVICE_PORT=587
EMAIL_SERVICE_USER="your_email@example.com"
EMAIL_SERVICE_PASS="your_email_password"

# Add any other specific variables you might need, e.g., for payment gateways
# STRIPE_SECRET_KEY="sk_test_..."
# RAZORPAY_KEY_ID="rzp_test_..."
# RAZORPAY_KEY_SECRET="your_razorpay_secret"
```

### ▶️ Running the Application

1.  **Start the Backend Server:**
    From the project root, run:
    ```bash
    npm run dev-server
    # Or if your package.json has a dedicated start script for backend
    # node app.js
    ```
    The backend will typically run on `http://localhost:8000` (or the port specified in your `.env`).

2.  **Start the Frontend Development Server:**
    From the project root, run:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The frontend will typically open in your browser at `http://localhost:5173` (or the port specified by Vite).

You should now be able to access the ChicBoutique e-commerce platform in your browser!

## 🌐 API/Backend

The backend is built with Node.js and Express.js, providing a RESTful API for the frontend to interact with. Key API modules include:

*   `/api/v1/auth`: User authentication, registration, login, and profile management.
*   `/api/v1/products`: CRUD operations for product listings, categories, and subcategories.
*   `/api/v1/cart`: Management of user shopping carts.
*   `/api/v1/orders`: Order creation, retrieval, and status updates.
*   `/api/v1/payments`: Handling payment processing.
*   `/api/v1/coupons`: Coupon code management.
*   `/api/v1/profile`: User profile updates and address management.

The API uses JWT for authentication and role-based middleware (`requiredLogin.middleware.js`, `roleGuard.middleware.js`) to protect routes and ensure secure access.

## 🎯 Why This Project? / Use Cases

*   **Fashion E-commerce Solution**: A ready-to-deploy template for businesses looking to establish an online presence for selling clothing, accessories, and other fashion items.
*   **Learning & Development**: An excellent resource for developers wanting to learn full-stack development with the MERN stack, focusing on e-commerce functionalities.
*   **Customization Base**: A robust foundation that can be easily customized and extended to fit specific business requirements or niche markets.
*   **Showcase Project**: Demonstrates a wide range of modern web development practices, including state management, authentication, payment integration, and robust data handling.

## 📝 Notes & Limitations

*   **Inferred Details**: Specific features, technologies, and project structure details, such as the use of Zustand or Nodemailer, were inferred based on common patterns associated with the provided filenames (e.g., `authStore.js`, `authEmail.js`).
*   **Payment Gateway**: The `payment.controllers.js` and `payment.route.js` files suggest payment integration, but the specific payment gateway (e.g., Stripe, PayPal, Razorpay) would need to be configured and tested.
*   **Deployment**: The README covers local development. Deployment to production environments would require additional steps for hosting the frontend and backend, setting up a production database, and configuring environment variables securely.
*   **Video Uploads**: `uploadVideo.middleware.js` indicates support for video uploads, likely via Cloudinary or similar services, which would enhance product media.
