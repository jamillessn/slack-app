
# 🧑‍💻 Slack App (Avion Version)

A Slack-inspired messaging app that allows users to register, log in, create channels, and communicate via direct and channel messages. Built with React, Vite, Chakra UI, and modern web technologies.

> 🔒 Supports authentication, messaging, and real-time channel collaboration.

<img width="1916" height="917" alt="Screenshot 2025-07-27 205616" src="https://github.com/user-attachments/assets/cf747841-e2dd-482c-abb4-40baf4e1d6c1" />
<img width="1915" height="915" alt="Screenshot 2025-07-27 201938" src="https://github.com/user-attachments/assets/0609637f-5433-476d-9297-d567ee292d0e" />


## ✨ Features

- ✅ User Registration and Login (Email + Password)
- 💬 Direct Messaging between users
- 🧵 Channel-based group messaging
- ➕ Create new channels
- 👥 Add users to channels
- 📥 Real-time message receiving (DMs + Channels)

---

## 🛠️ Tech Stack

| Layer        | Tech                      |
|--------------|---------------------------|
| Frontend     | React + Vite              |
| UI Framework | Chakra UI + Framer Motion |
| HTTP Client  | Axios                     |
| Routing      | React Router DOM          |
| Forms & UX   | React Select, Toastify    |
| State Mgmt   | React Context / Hooks     |
| Date Utils   | date-fns                  |

---

## 📦 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/jamillessn/slack-app.git
   cd slack-app
2. **Install dependencies**
    ```bash
    npm install
3. **Start development server**
   ```bash
   npm run dev
---

## 🧪 Scripts
| Command            | Description                      |
|--------------------|----------------------------------|
| `npm run dev`      | Run development server           |
| `npm run build`    | Create production build          |
| `npm run test`     | Run unit tests (Vitest)          |
| `npm run lint`     | Check linting errors             |
| `npm run preview`  | Preview production build         |


---

## 🌐 API Integration
This app connects to a Slack-style backend that handles:

- Authentication (register, login)
- User and channel management
- Message creation and retrieval

---

## 📂 Project Structure
```csharp
src/
├── assets/        # Media (logos and gifs)
├── components/    # Reusable components
├── pages/         # Route views (Login, Register, Main page)
├── utils/         # Helper functions
├── App.jsx        # App entrypoint
├── main.jsx       # Routes
public/
vite.config.js     # Vite config
```

---

## 🔐 Authentication
Users are authenticated via email/password and issued a session token. The app manages session state and redirects based on login status.

---

## 🧑‍🤝‍🧑 Channel & Messaging Flow
-Users can create new channels and invite other users
-Channel messages appear in thread view
-Users can send and receive DMs
-All messages are fetched from the backend via API calls

---

## 👨‍🏫 Developed For
Project under Avion School / portfolio showcase. Built by @jamillessn.
