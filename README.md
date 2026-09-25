# Bella's Restaurant — Haripur (GT Road)

Official Web Application & Ordering Portal for **Bella's Haripur**, located at Akhtar Nawaz Khan Plaza, Main GT Road, Haripur.

## Tech Stack
- **Frontend:** Semantic HTML5, Tailwind CSS, Lucide / FontAwesome, Modern ES6 JavaScript
- **Backend:** FastAPI (Python 3.10+), SQLAlchemy, Pydantic, SQLite
- **Integrations:** Direct WhatsApp Ordering Engine (+92 336 1131166), Google Maps Interactive Embed, Real-Time PKT Schedule Engine.

## Local Setup

### 1. Backend Run Karein
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000