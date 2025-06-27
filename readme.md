# 💬 Lightweight Feedback System

A lightweight, role-based feedback management application where **Managers** can provide feedback to their **Employees**, and Employees can view and acknowledge the feedback.

---

## 📁 Folder Structure

```
lightWeight_feedback_system/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── auth/             # JWT auth logic
│   │   ├── crud/             # Database CRUD operations
│   │   ├── models/           # SQLAlchemy models
│   │   ├── routes/           # API endpoints
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── utils/            # Helper utilities
│   │   ├── main.py           # FastAPI entrypoint
│   │   └── database.py       # DB connection logic
│   ├── Dockerfile            # Backend Docker container
│   ├── requirements.txt      # Backend dependencies
│   └── .env                  # Environment variables
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   └── LoginPage.jsx
│   │   │   ├── managerPages/
│   │   │   │   ├── ManagerDashboard.jsx
│   │   │   │   ├── EmployeeListPage.jsx
│   │   │   │   └── FeedbackFormPage.jsx
│   │   │   └── employeePages/
│   │   │       ├── EmployeeTimeline.jsx
│   │   │       └── AcknowledgePage.jsx
│   ├── services/             # API service handlers
│   ├── utils/                # Utility functions
│   ├── App.jsx
│   ├── index.js
│   └── package.json
│
├── docker-compose.yml        # Docker Compose for backend + DB
└── README.md                 # Project documentation
```

---

## 🛠️ Tech Stack

### 🔹 Backend
- **FastAPI** – High-performance Python web framework.
- **PostgreSQL** – Relational database.
- **SQLAlchemy** – ORM for database interactions.
- **Pydantic** – Data validation and serialization.
- **JWT Auth** – Role-based access control.

### 🔹 Frontend
- **React.js** – Component-based UI framework.
- **React Router DOM** – Client-side routing with role protection.
- **Axios** – HTTP client for API integration.
- **Tailwind CSS** – Utility-first CSS framework.

---

## 🚀 Getting Started

### 1. 📄 Backend Environment Variables

Create a `.env` file inside the `backend/` directory:

```
DATABASE_URL=postgresql+psycopg2://postgres:postgres@db:5432/feedback_db
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

### 2. 🐳 Dockerized Setup

#### 📦 `backend/Dockerfile`

```
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the port uvicorn will run on
EXPOSE 8000

# Command to run the app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

```

#### 🧩 `docker commands`

```
docker build -t feedback-backend .
docker run -d --name feedback-backend --network feedback-net -p 8000:8000 feedback-backend

```

---

##  Run the App (Frontend + Backend Setup)

Clone the Repository

```
git clone https://github.com/your-username/lightWeight_feedback_system.git
cd lightWeight_feedback_system
# Replace your-username with your actual GitHub username if applicable.
```

#### Option : Backend setup

```
cd backend
python -m venv venv
source venv/bin/activate  
pip install -r requirements.txt
uvicorn app.main:app --reload
```

> Ensure your `.env` is configured correctly and PostgreSQL is running.
```
.env
SECRET_KEY=yout_decret_key

DATABASE_URL=your url

```
---

###  Frontend Setup

```
cd frontend
npm install
npm run dev
```

- Frontend running: http://localhost:3000

---

## ✅ Summary

| Component | Stack                 | Run Command                      | URL                              |
|-----------|-----------------------|----------------------------------|----------------------------------|
| Backend   | FastAPI + PostgreSQL  | `docker-compose up` or `uvicorn` | http://localhost:8000/docs       |
| Frontend  | React + Tailwind CSS  | `npm install && npm start`       | http://localhost:3000            |

---

## 🔐 Role-Based Access

| Role     | Routes                                          | Permissions                       |
|----------|--------------------------------------------------|-----------------------------------|
| Manager  | `/manager/dashboard`, `/manager/employees`     | Submit, edit feedback             |
| Employee | `/employee/timeline`, `/employee/acknowledge/:id` | View and acknowledge feedback     |

---

## 📡 API Endpoints

### Auth
- `POST /auth/login`

### Manager
- `GET /manager/employees`
- `POST /feedback/`
- `PUT /feedback/{id}`

### Employee
- `GET /feedback/my`
- `POST /feedback/{id}/acknowledge`

---

## 📝 License

Licensed under the **MIT License** — free to use, share, and modify.