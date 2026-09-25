from pydantic import BaseModel, Field
from typing import List, Optional

class OrderItem(BaseModel):
    title: str
    price: float
    quantity: int
    category: Optional[str] = None

class OrderCreate(BaseModel):
    customer_name: str = Field(..., min_length=1)
    order_type: str = Field(..., min_length=2)
    notes_or_address: Optional[str] = "Standard preparation"
    items: List[OrderItem]
    total_amount: float

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2)
    phone: str = Field(..., min_length=6)
    message: str = Field(..., min_length=5)