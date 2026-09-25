import os
import json
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

import models, schemas
from database import engine, get_db, Base

load_dotenv()

# Database tables create karna
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Bella's Haripur REST API",
    description="Backend engine for orders logging, table inquiries, and real-time status.",
    version="1.0.0"
)

# CORS setup taake frontend se bina issue call aye
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "restaurant": "Bella's Haripur",
        "status": "Online",
        "api_docs": "/docs",
        "gt_road_location": "Akhtar Nawaz Khan Plaza, Haripur"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "system": "operational"}

@app.post("/api/orders", status_code=status.HTTP_201_CREATED)
def create_order(payload: schemas.OrderCreate, db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Food tray cannot be empty.")

    items_data = [item.model_dump() for item in payload.items]

    new_order = models.Order(
        customer_name=payload.customer_name,
        order_type=payload.order_type,
        notes_or_address=payload.notes_or_address,
        items_json=json.dumps(items_data),
        total_amount=payload.total_amount
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return {
        "success": True,
        "order_id": f"BEL-{new_order.id:04d}",
        "message": "Order recorded in Bella's kitchen ledger."
    }

@app.get("/api/orders")
def get_all_orders(db: Session = Depends(get_db)):
    orders = db.query(models.Order).order_by(models.Order.id.desc()).limit(50).all()
    results = []
    for ord in orders:
        results.append({
            "order_id": f"BEL-{ord.id:04d}",
            "customer_name": ord.customer_name,
            "order_type": ord.order_type,
            "notes": ord.notes_or_address,
            "items": json.loads(ord.items_json),
            "total_amount": ord.total_amount,
            "created_at": ord.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })
    return results

@app.post("/api/contact", status_code=status.HTTP_201_CREATED)
def submit_contact_inquiry(payload: schemas.ContactCreate, db: Session = Depends(get_db)):
    new_inquiry = models.ContactInquiry(
        name=payload.name,
        phone=payload.phone,
        message=payload.message
    )
    db.add(new_inquiry)
    db.commit()
    db.refresh(new_inquiry)

    return {
        "success": True,
        "inquiry_id": new_inquiry.id,
        "message": f"Thank you {payload.name}, your message has been logged for Bella's team."
    }

@app.get("/api/contact")
def get_all_inquiries(db: Session = Depends(get_db)):
    return db.query(models.ContactInquiry).order_by(models.ContactInquiry.id.desc()).all()