# 🧠 IndusBrain AI

### Enterprise Knowledge Intelligence Platform

> Transforming scattered enterprise documents into an AI-powered knowledge platform for faster search, smarter insights, and better decision-making.

---

## 📖 Overview

IndusBrain AI is an **Enterprise Knowledge Intelligence Platform** that enables organizations to upload, manage, search, and interact with enterprise documents using Artificial Intelligence.

Instead of manually searching through hundreds of pages, users can ask questions in natural language and receive accurate, context-aware answers powered by **Retrieval-Augmented Generation (RAG)**. The platform also generates knowledge graphs, semantic search results, AI insights, and analytics to improve productivity and decision-making.

---

## ✨ Features

- 🔐 Secure User Authentication
- 📄 Document Upload & Management
- 🤖 AI Copilot (Chat with Documents)
- 🔍 Semantic AI Search
- 🧠 Retrieval-Augmented Generation (RAG)
- 🕸️ Interactive Knowledge Graph
- 📊 Dashboard & Analytics
- 📈 AI Insights & Executive Summary
- 🌙 Light & Dark Mode
- ⚙️ User Profile & Security Settings

---

## 🏗️ System Architecture

```text
                    +----------------------+
                    |      Next.js UI      |
                    +----------+-----------+
                               |
                               |
                         REST API (FastAPI)
                               |
        +----------------------+----------------------+
        |                      |                      |
        |                      |                      |
   SQLite Database        ChromaDB             AI Services
        |               (Vector Store)              |
        |                      |                    |
        +----------------------+--------------------+
                               |
                          Ollama (Qwen 2.5)
                               |
                      Retrieval-Augmented Generation
```

---

# 🛠️ Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

---

## Backend

- FastAPI
- Python
- SQLAlchemy
- SQLite
- JWT Authentication

---

## Artificial Intelligence

- Ollama
- Qwen 2.5
- ChromaDB
- Sentence Transformers
- Retrieval-Augmented Generation (RAG)
- Semantic Search
- OCR
- Entity Extraction
- Relationship Extraction
- Knowledge Graph

---

# 📂 Project Structure

```text
IndusBrain-AI/
│
├── backend/
│   ├── app/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── ...
│
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

- Python 3.11+
- Node.js 20+
- npm
- Ollama

---

## Clone Repository

```bash
git clone https://github.com/<pakshalsolanki05>/IndusBrain-AI.git

cd IndusBrain-AI
```

---

# Backend Setup

```bash
cd backend

python -m venv .venv
```

Activate Virtual Environment

### Windows

```bash
.venv\Scripts\activate
```

### Linux / macOS

```bash
source .venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run FastAPI

```bash
uvicorn main:app --reload
```

Backend will run on:

```
http://localhost:8000
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend will run on

```
http://localhost:3000
```

---

# Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
SECRET_KEY=2650082d90e346d3aac43b63c83f5766c6ef461ae10b3f2e1d5dbd970c8cfb3e5b951bfaead8d8a70b1b246e5fe74d3488e7908f20e9dc6ca46bc8c79debeb0d
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
OLLAMA_MODEL=qwen2.5:3b
```

---

# Application Modules

| Module | Description |
|----------|-------------|
| Authentication | Secure login and registration |
| Dashboard | Document analytics and statistics |
| Document Management | Upload and organize enterprise documents |
| AI Copilot | Chat with uploaded documents |
| Enterprise Search | Semantic search across all documents |
| Knowledge Graph | Visualize relationships between entities |
| AI Insights | Executive summaries and recommendations |
| Settings | Profile, security, and appearance management |

---

# Screenshots

# 📸 Screenshots

## 🔐 Login

![Login](screenshots/login.png)

---

## 📊 Dashboard

### Overview

![Dashboard](screenshots/dashboard1.png)

### Analytics

![Dashboard Analytics](screenshots/dashboard2.png)

---

## 📄 Document Upload

![Upload](screenshots/upload.png)

---

## 📚 Knowledge Base

![Knowledge Base](screenshots/knowledge-base.png)

---

## 🤖 AI Copilot

![AI Copilot](screenshots/ai-copilot.png)

---

## 💬 Document Chat

![Document Chat](screenshots/document-chat.png)

---

## 🔍 Enterprise Search

![Enterprise Search](screenshots/document-overview.png)

---

## 🕸️ Knowledge Graph

### Graph View

![Knowledge Graph](screenshots/knowledge-graph1.png)

### Relationship View

![Knowledge Graph Relationships](screenshots/knowledge-graph2.png)

---

## 📈 AI Insights

### Executive Summary

![Insights](screenshots/insights1.png)

### Analytics

![Insights Analytics](screenshots/insights2.png)

---

## ⚙️ Settings

### Profile

![Settings](screenshots/settings1.png)

### Security & Appearance

![Settings](screenshots/settings2.png)

---

# Future Enhancements

- Multi-user collaboration
- Role-Based Access Control (RBAC)
- Voice-based AI Assistant
- Cloud Deployment
- Multi-language Support
- Enterprise Integrations (SharePoint, Google Drive, Microsoft Teams)
- AI-powered Report Generation

---

# Challenges

- Building an efficient Retrieval-Augmented Generation pipeline
- Semantic document search
- Knowledge graph generation
- Integrating AI with enterprise workflows
- Creating a responsive enterprise-grade interface

---

# What We Learned

- Building production-style AI applications
- Vector databases and embeddings
- FastAPI backend development
- Modern Next.js architecture
- Retrieval-Augmented Generation (RAG)
- Knowledge Graph visualization
- Full-stack AI system integration

---

# License

This project is licensed under the MIT License.

---

# Author

**Pakshal**

If you found this project helpful, consider giving it a ⭐ on GitHub!