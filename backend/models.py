from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from datetime import datetime
from database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    order_type = Column(String(50), nullable=False) # 'Takeaway / Dine-in' or 'Home Delivery'
    notes_or_address = Column(Text, nullable=True)
    items_json = Column(Text, nullable=False)
    total_amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ContactInquiry(Base):
    __tablename__ = "contact_inquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)