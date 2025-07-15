# NixFunds – Finance Tracker App

A modern, full-stack finance tracker to manage your income and expenses with ease.

---

## 📦 Backend

- **models/transaction.js**  
  Defines what a transaction looks like (the schema) using Mongoose.

- **routes/transactionRoutes.js**  
  Handles API requests for transactions (add/get/update/delete).

- **routes/authRoutes.js**  
  Handles authentication (signup/login) with strong password policy and rate limiting.

- **index.js**  
  Main server file. Connects to MongoDB, sets up Express, loads routes, and starts the server.

- **.env**  
  Stores your database connection string and environment variables (see below).

**How it works:**

- The **model** defines the data structure.
- The **routes** define how to interact with that data via HTTP requests (REST API).
- The **main server** connects everything and runs the app.
- The **frontend** talks to the backend via HTTP requests, and the backend saves/fetches data from MongoDB.

---

## 💻 Frontend

- **index.html**  
  Structure of the app (header, modal, transaction list, etc.).

- **styles.css**  
  Visual style, layout, dark mode, and responsive design.

- **app.js**  
  All interactive logic: fetch, add, filter, theme toggle, and stats.

**How it works:**

- The frontend is what users see and use.
- It communicates with the backend using JavaScript (`fetch`).
- The backend handles all data storage and retrieval with MongoDB.
- All data flows through the backend, keeping your app secure and organized.

---

## 🚀 Quick Start

1. **Clone the repository**
2. **Install dependencies**  
   In `/backend`:  
   `npm install`
3. **Set up your `.env` file**  
   Example:
   ```
   PORT=8000
   MONGO_URL="mongodb://localhost:27017/finance-tracker"
   JWT_SECRET="your_strong_secret_here"
   ```
4. **Start the backend server**  
   `npm start`
5. **Open `frontend/index.html` in your browser`**

---

## 📝 Features

- Add, view, edit, and delete transactions (income/expense)
- Filter transactions by type, month, and year
- See total balance, income, and expenses
- Responsive design and dark mode toggle
- Strong password policy (min 8 chars, upper/lower/digit/special)
- Rate limiting and input validation for security
- Toast notifications for user feedback

---

## 📚 Project Structure

```
backend/
  models/
    transaction.js
    user.js
  routes/
    transactionRoutes.js
    authRoutes.js
  middleware/
    auth.js
    errorHandler.js
  index.js
  .env

frontend/
  index.html
  css/
    styles.css
  js/
    app.js
    ...
```

---

**Enjoy tracking your finances!**

---

## 🚀 Deployment & Environment

### Environment Variables

Create a `.env` file in `/backend` with:

```
PORT=8000
MONGO_URL="mongodb://localhost:27017/finance-tracker"
JWT_SECRET="your_strong_secret_here"
```

- **Never commit your real .env to git.**
- Add a `.env.example` file for reference (no secrets).

### Production Deployment

- Use a process manager like PM2 or Docker for backend.
- Serve the frontend with a static server (e.g., Nginx, Vercel, Netlify, or GitHub Pages).
- Set `NODE_ENV=production` in your environment.
- Use a strong, unique `JWT_SECRET` in production.
- Secure your MongoDB instance (do not expose to the public internet).

### Security & Best Practices

- Strong password policy enforced on signup.
- Rate limiting and input validation are enabled on auth and transaction routes.
- All secrets and sensitive config should be in `.env`.
- Use HTTPS in production.

### Final Touches

- Favicon included (`/frontend/assets/favicon.png`). Replace with your own for branding.
- Accessibility: Improved ARIA, color contrast, and keyboard navigation for a11y compliance.

---
