# CodeX IDE 🖥️

A full-stack **MERN** online code editor supporting **15+ programming languages**, built with:
- **MongoDB** — User & snippet storage
- **Express.js** — REST API backend
- **React.js** — Frontend with Monaco Editor (VS Code engine)
- **Node.js** — Server runtime
- **Judge0 API** — Code execution engine

---

## 🗂️ Project Structure

```
codex-ide/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with bcrypt
│   │   └── Snippet.js       # Code snippet schema
│   ├── routes/
│   │   ├── auth.js          # Register / Login / Me
│   │   ├── code.js          # Code execution via Judge0
│   │   └── snippets.js      # CRUD for saved snippets
│   ├── middleware/
│   │   └── auth.js          # JWT protect middleware
│   ├── server.js            # Express app entry
│   ├── .env.example         # Environment variable template
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js   # Global auth state
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   └── Navbar.css
    │   ├── pages/
    │   │   ├── Home.js / Home.css
    │   │   ├── Editor.js / Editor.css
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── Snippets.js / Snippets.css
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

---

## ⚡ Prerequisites

Install the following before starting:

| Tool | Version | Download |
|------|---------|---------|
| Node.js | v18+ | https://nodejs.org |
| MongoDB | v6+ | https://mongodb.com/try/download/community |
| npm | v9+ | Comes with Node.js |

---

## 🔑 Step 1: Get Judge0 API Key (FREE)

1. Go to: https://rapidapi.com/judge0-official/api/judge0-ce
2. Sign up for a free RapidAPI account
3. Subscribe to the **Basic plan** (100 requests/day free)
4. Copy your **X-RapidAPI-Key** from the dashboard

---

## 🛠️ Step 2: Setup Backend

```bash
# Navigate to backend
cd codex-ide/backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/codex-ide
JWT_SECRET=make_this_a_long_random_string_abc123xyz
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key_here
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
```

Start MongoDB (if running locally):
```bash
# On Windows
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"

# On Mac/Linux
mongod
# or if installed as service:
sudo systemctl start mongod
```

Start the backend:
```bash
npm run dev
# ✅ Server running on port 5000
# ✅ MongoDB Connected
```

---

## 💻 Step 3: Setup Frontend

```bash
# In a new terminal, navigate to frontend
cd codex-ide/frontend

# Install dependencies
npm install

# Start development server
npm start
# Opens http://localhost:3000
```

---

## ✅ Step 4: Test the App

1. Open http://localhost:3000
2. Click **Sign Up** → create an account
3. Go to **Editor** → select a language → click **▶ Run**
4. See output in the right panel
5. Click **💾 Save** to save a snippet
6. Visit **My Snippets** to view saved code

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (auth required) |

### Code Execution
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/code/run` | Execute code |
| GET | `/api/code/languages` | List supported languages |

### Snippets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/snippets` | Get user's snippets (auth required) |
| POST | `/api/snippets` | Save a snippet (auth required) |
| PUT | `/api/snippets/:id` | Update snippet (auth required) |
| DELETE | `/api/snippets/:id` | Delete snippet (auth required) |
| GET | `/api/snippets/public` | Get public snippets |

---

## 🚀 Supported Languages

JavaScript, Python, Java, C++, C, TypeScript, Go, Rust, Ruby, PHP, Swift, Kotlin, C#, Bash, R

---

## 🎯 Resume Description

**Project: CodeX IDE — Full-Stack Online Code Editor**

- Built a full-stack online IDE supporting **15+ programming languages** using **React.js, Node.js, Express.js, and MongoDB**
- Integrated **Judge0 API** for real-time server-side code execution with stdin/stdout support
- Implemented **Monaco Editor** (VS Code engine) with syntax highlighting, autocomplete, and bracket colorization
- Designed a secure **JWT authentication** system with bcrypt password hashing
- Built RESTful API with 3 resource groups — authentication, code execution, and snippet management
- Developed a **Snippets library** with search, language filtering, and CRUD operations

**Tech Stack:** React, Node.js, Express.js, MongoDB, Monaco Editor, Judge0 API, JWT, bcrypt, Axios

---

## 🔧 Troubleshooting

**MongoDB connection failed:**
- Make sure MongoDB is running: `mongod`
- Or use MongoDB Atlas (cloud): replace MONGO_URI with your Atlas connection string

**Judge0 API errors:**
- Check your API key is correct in `.env`
- Free tier has 100 calls/day — upgrade if needed
- Alternatively, self-host Judge0: https://github.com/judge0/judge0

**CORS errors:**
- Make sure backend is running on port 5000
- The frontend proxy in `package.json` forwards `/api` calls to `localhost:5000`

**Port already in use:**
```bash
# Kill process on port 5000
npx kill-port 5000
# Kill process on port 3000
npx kill-port 3000
```
