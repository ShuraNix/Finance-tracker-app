# NixFunds – Finance Tracker App

A modern, full-stack finance tracker to manage your income and expenses with ease.

---

## 📦 Backend

- **models/transaction.js**  
  Defines what a transaction looks like (the schema) using Mongoose.

- **routes/transactionRoutes.js**  
  Handles API requests for transactions (add/get).

- **index.js**  
  Main server file. Connects to MongoDB, sets up Express, loads routes, and starts the server.

- **.env**  
  Stores your database connection string and environment variables.

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
   ```
4. **Start the backend server**  
   `npm start`
5. **Open `frontend/index.html` in your browser**

---

## 📝 Features

- Add and view transactions (income/expense)
- Filter transactions by type
- See total balance, income, and expenses
- Responsive design and dark mode toggle

---

## 📚 Project Structure

```
backend/
  models/
    transaction.js
  routes/
    transactionRoutes.js
  index.js
  .env

frontend/
  index.html
  css/
    styles.css
  js/
    app.js
```

---

**Enjoy tracking your finances!**
