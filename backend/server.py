from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from typing import List, Optional
import uuid
from datetime import datetime

load_dotenv()

app = FastAPI(title="Mr. Sigmar Services API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
client = None
db = None

@app.on_event("startup")
async def startup_db_client():
    global client, db
    mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(mongo_url)
    db = client["mr_sigmar_db"]
    
@app.on_event("shutdown")
async def shutdown_db_client():
    global client
    if client:
        client.close()

# Pydantic models
class ContactForm(BaseModel):
    name: str
    email: str
    phone: str
    service: str
    message: str
    created_at: Optional[datetime] = None

class Testimonial(BaseModel):
    name: str
    rating: int
    comment: str
    service: str
    created_at: Optional[datetime] = None
    approved: Optional[bool] = False

class Service(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    active: bool = True

# API Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Mr. Sigmar Services API is running"}

@app.post("/api/contact")
async def submit_contact_form(contact: ContactForm):
    contact.created_at = datetime.utcnow()
    contact_dict = contact.dict()
    contact_dict["id"] = str(uuid.uuid4())
    
    try:
        await db.contacts.insert_one(contact_dict)
        return {"success": True, "message": "Contact form submitted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to submit contact form")

@app.get("/api/services")
async def get_services():
    services = [
        {
            "id": "1",
            "title": "Air Conditioner Installation & Maintenance",
            "description": "Professional installation, repair and maintenance of air conditioning systems",
            "icon": "❄",
            "active": True
        },
        {
            "id": "2",
            "title": "Refrigerator and Freezer Repair",
            "description": "Expert repair services for refrigerators, freezers and cooling appliances",
            "icon": "🧊",
            "active": True
        },
        {
            "id": "3",
            "title": "Electronic Repairs",
            "description": "Comprehensive repair services for various electronic devices and appliances",
            "icon": "⚡",
            "active": True
        },
        {
            "id": "4",
            "title": "Electric Gate Installation",
            "description": "Professional installation and maintenance of electric gates and access systems",
            "icon": "🚪",
            "active": True
        },
        {
            "id": "5",
            "title": "General Electrical Services",
            "description": "Complete electrical services for homes and businesses",
            "icon": "🔧",
            "active": True
        }
    ]
    return services

@app.get("/api/testimonials")
async def get_testimonials():
    try:
        testimonials = await db.testimonials.find({"approved": True}).to_list(length=100)
        for testimonial in testimonials:
            testimonial["_id"] = str(testimonial["_id"])
        return testimonials
    except Exception as e:
        # Return sample testimonials if database is not available
        return [
            {
                "id": "1",
                "name": "Maria Silva",
                "rating": 5,
                "comment": "Excellent service! Mr. Sigmar fixed my air conditioner quickly and professionally.",
                "service": "Air Conditioner Repair"
            },
            {
                "id": "2",
                "name": "João Santos",
                "rating": 5,
                "comment": "Very reliable technician. My electric gate has been working perfectly since the installation.",
                "service": "Electric Gate Installation"
            },
            {
                "id": "3",
                "name": "Ana Costa",
                "rating": 5,
                "comment": "Fast response and fair prices. Highly recommend Mr. Sigmar's services!",
                "service": "Electronic Repairs"
            }
        ]

@app.post("/api/testimonials")
async def submit_testimonial(testimonial: Testimonial):
    testimonial.created_at = datetime.utcnow()
    testimonial.approved = False  # Requires admin approval
    testimonial_dict = testimonial.dict()
    testimonial_dict["id"] = str(uuid.uuid4())
    
    try:
        await db.testimonials.insert_one(testimonial_dict)
        return {"success": True, "message": "Testimonial submitted for review"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to submit testimonial")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)