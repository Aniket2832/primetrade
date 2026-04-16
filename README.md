# Create root README
cat > README.md << 'EOF'
# 🚀 Primetrade.ai — Task Management System

Full-stack application with a scalable REST API and modern glassmorphism frontend.

## 📁 Structure
primetrade/
├── backend/    → Node.js + Express + PostgreSQL (Neon)
└── frontend/   → React + Vite + Tailwind CSS

## 🔗 Live Links

- **Frontend:** https://primetrade-frontend.vercel.app
- **Backend API:** https://primetrade-api.onrender.com
- **Swagger Docs:** https://primetrade-api.onrender.com/api-docs

## ⚡ Quick Start

### Backend
```bash
cd backend
npm install
# add .env (see backend/README.md)
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# add .env (see frontend/.env.example)
npm run dev
```

## 👤 Author
Aniket — Full Stack Developer
EOF