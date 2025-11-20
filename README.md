# tinylink-app# 
🔗TinyLink – URL Shortener

A clean, full-stack URL shortener built with:

- **React (frontend)**
- **Node + Express (backend)**
- **PostgreSQL (Neon DB)**
- **Modern UI/UX**
- **Click tracking + stats**

---

## ✔ Features

### 🔧 Core Functionality
- [x] Add long URLs  
- [x] Auto-generate short codes  
- [x] Custom short codes  
- [x] Prevent duplicate codes  
- [x] Redirect short links  
- [x] Count clicks  
- [x] Track last clicked timestamp  
- [x] View per-link stats  

### 🎨 Frontend UX
- [x] Inline form validation  
- [x] Error + success states  
- [x] Search/filter links  
- [x] Sorting (Code, URL, Clicks, Last Clicked)  
- [x] Copy short links  
- [x] Responsive layout  
- [x] Clean table + ellipsis for long URLs  

### 🗃 Backend
- [x] PostgreSQL storage  
- [x] Validation (URL + Code formats)  
- [x] Unique code enforcement  
- [x] Redirect + click tracking  
- [x] Health check endpoint  


🛠 Backend (Express + PostgreSQL)

Go to the backend folder:

cd server
npm install


Create a .env file:

PORT=8080
DATABASE_URL=your_neon_postgres_connection_string


Start the backend:

npm start


Backend runs at:

http://localhost:8080

🖥 Frontend (React)

Go to the frontend folder:

cd client
npm install


Set backend API URL in:

src/services/apilist.js


Example:

const BASE = "http://localhost:8080";


Start frontend:

npm start


Frontend runs at:

http://localhost:3000

✔ Features

Shorten URLs

Auto-generate short codes

Custom short codes

Prevent duplicate codes

Redirect to destination

Track total clicks

Track last-click time

Per-link stats page

Form validation

Inline error messages

Search + filter

Sortable table columns

Copy button for short link

Responsive layout

Clean UI

📡 API Endpoints
POST    /api/links
GET     /api/links
GET     /api/links/:code
DELETE  /api/links/:code
GET     /:code
GET     /healthz


☁ Deployment Notes

Backend:
Deploy to Render or any Node hosting platform.
Add .env variables in dashboard.

Frontend:
Deploy to Vercel/Netlify.
Set API base URL in environment variables.

Database:
Neon PostgreSQL connection string goes into .env.

🧰 Tech Stack

Frontend: React, Axios
Backend: Node.js, Express
Database: PostgreSQL (Neon)

📜 License

MIT License.

👤 Author

Built by Raja Gopal Gajula

