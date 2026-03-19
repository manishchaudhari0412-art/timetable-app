# 📅 Timetable Management System — MEAN Stack

A full-stack **Timetable Management System** built with the **MEAN stack** (MongoDB, Express.js, Angular/Vanilla JS, Node.js), containerized with **Docker & Docker Compose**.

---

## 🚀 Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | HTML5, CSS3, Vanilla JS |
| Backend    | Node.js + Express.js |
| Database   | MongoDB             |
| Container  | Docker + Docker Compose |

---

## 📁 Project Structure

```
timetable-mean/
├── backend/
│   ├── models/          # Mongoose models (Teacher, etc.)
│   ├── routes/          # Express API routes
│   ├── server.js        # Entry point
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── index.html       # Main UI
│   └── style.css        # Styling
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose installed
- OR Node.js v18+ and MongoDB installed locally

---

### 🐳 Run with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/timetable-mean.git
cd timetable-mean

# Start all services
docker-compose up --build

# Access the app
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
```

---

### 💻 Run Locally (Without Docker)

```bash
# Install backend dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI

# Start backend
npm start

# Open frontend/index.html in your browser
```

---

## 🌐 API Endpoints

| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| GET    | `/api/teachers`      | Get all teachers         |
| POST   | `/api/teachers`      | Add a new teacher        |
| DELETE | `/api/teachers/:id`  | Delete a teacher         |
| GET    | `/api/timetable`     | Get full timetable       |
| POST   | `/api/timetable`     | Save timetable entry     |

---

## 🔧 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=mongodb://mongo:27017/timetabledb
PORT=5000
```

---

## 📸 Screenshot

> Add your app screenshot here!

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use and modify!

---

Made with ❤️ using the MEAN Stack
