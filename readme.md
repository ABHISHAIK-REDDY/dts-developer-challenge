# HMCTS Task Management System

A professional, full-stack Task Management MVP built for **HMCTS (His Majesty's Courts and Tribunals Service)** caseworkers. This application is designed to handle task lifecycles with high reliability, type safety, and a focus on accessibility (A11y).

## 🚀 Quick Start

### 1. Prerequisites
* **Node.js** (v20.x or v22.x recommended)
* **npm** (v10.x or higher)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Ensure DATABASE_URL in .env is set to "file:./dev.db"
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will be running at `http://localhost:5173`.

---

## 🏗️ Architectural Decisions

* **Node.js & TypeScript:** Leveraged for a unified, type-safe development experience across the entire stack.
* **SQLite with Prisma ORM:** Chosen for its "zero-config" portability. This allows reviewers to clone and run the project immediately without an external database server, while maintaining strict relational schemas.
* **Layered Architecture:** The backend follows the **Controller-Service-Repository** pattern, ensuring that business logic is decoupled from the Express framework and database implementation.
* **State Management:** Implemented via the **React Context API** for a lightweight, global "Single Source of Truth."
* **Validation:** Powered by **Zod**. It provides schema-driven validation for both API requests and Frontend forms, including logic to prevent `dueDate` from being in the past.

---

## 🛠️ Key Features

* **Full CRUD & Edit:** Seamlessly create, view, update (including status and details), and delete caseworker tasks.
* **Search & Discovery:** * **ID/Title Search:** Quick lookup via a global search bar for specific tasks or IDs.
    * **Dynamic Filters:** Filter by **Status** ('To Do', 'In Progress', 'Done').
    * **Advanced Sorting:** Sort tasks by **Due Date** or **Status** to prioritize urgent legal work.
* **Advanced UI Controls:**
    * **TaskViewToggle:** Switch between a high-density **Table View** and a focused **Card View**.
* **Accessibility (A11y):** Built with semantic HTML5 tags (`<main>`, `<section>`, `<label>`) and keyboard-navigable components to meet government standards.
* **Responsive Design:** Fully responsive interface built with **Tailwind CSS**.

---

## 📑 API Documentation

**Base URL:** `http://localhost:4000`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/health` | `GET` | Health check for monitoring system uptime. |
| `/tasks` | `GET` | Retrieve all tasks (supports query params for filtering/sorting). |
| `/tasks/:id` | `GET` | Retrieve a single task by its UUID. |
| `/tasks` | `POST` | Create a new caseworker task. |
| `/tasks/:id` | `PATCH` | Update task status, title, or details. |
| `/tasks/:id` | `DELETE` | Permanently remove a task. |

### Example POST Payload:
```json
{
  "title": "Review Case #8821",
  "description": "Verify witness statements and verify evidence.",
  "status": "To Do",
  "dueDate": "2026-12-31T23:59:59Z"
}
```

---

## 🧪 Testing

The backend includes a suite of unit tests to ensure business logic reliability.
```bash
cd backend
npm test
```
*Tests currently cover: Task creation validation, status update transitions, and error handling for missing resources.*

---

## 🛡️ Best Practices & Quality
* **Global Error Handling:** Middleware-driven approach to catch and format API errors consistently.
* **Loading States:** Integrated UI feedback for asynchronous operations (skeletons/spinners).
* **Clean Code:** Adheres to SOLID principles and clear naming conventions.
* **Security:** Sanitized inputs and protected against common vulnerabilities (SQL injection via Prisma).

---