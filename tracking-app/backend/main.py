from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="Phishing Awareness Training Backend",
    description="Backend API for tracking phishing awareness training interactions",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for data validation
class PageView(BaseModel):
    id: Optional[int] = None
    campaign_id: str
    page_type: str
    user_email: str
    ip_address: str
    timestamp: datetime
    time_spent: Optional[float] = None
    clicked_purchase: bool = False
    entered_email: bool = False
    entered_password: bool = False
    captured_pennkey: Optional[str] = None

class Campaign(BaseModel):
    id: Optional[int] = None
    name: str
    description: str
    target_group: str
    start_date: datetime
    end_date: Optional[datetime] = None
    page_type: str

# In-memory database
page_views_db = []
campaigns_db = []
page_view_counter = 1
campaign_counter = 1

@app.get("/")
async def root():
    """Root endpoint returning a welcome message"""
    return {"message": "Welcome to the Phishing Awareness Training Backend"}

@app.post("/track/pageview", response_model=PageView)
async def track_page_view(view: PageView):
    """Track a new page view"""
    global page_view_counter
    view.id = page_view_counter
    page_view_counter += 1
    page_views_db.append(view)
    return view

@app.put("/track/pageview/{view_id}/purchase-click", response_model=PageView)
async def track_purchase_click(view_id: int):
    """Track when user clicks purchase button"""
    view_idx = next((idx for idx, view in enumerate(page_views_db) if view.id == view_id), None)
    if view_idx is None:
        raise HTTPException(status_code=404, detail="Page view not found")
    
    page_views_db[view_idx].clicked_purchase = True
    return page_views_db[view_idx]

@app.put("/track/pageview/{view_id}/email-entered", response_model=PageView)
async def track_email_entered(view_id: int, pennkey: str):
    """Track when user enters their email/pennkey"""
    view_idx = next((idx for idx, view in enumerate(page_views_db) if view.id == view_id), None)
    if view_idx is None:
        raise HTTPException(status_code=404, detail="Page view not found")
    
    page_views_db[view_idx].entered_email = True
    page_views_db[view_idx].captured_pennkey = pennkey
    page_views_db[view_idx].user_email = f"{pennkey}@upenn.edu"
    return page_views_db[view_idx]

@app.put("/track/pageview/{view_id}/password-entered", response_model=PageView)
async def track_password_entered(view_id: int):
    """Track when user enters their password"""
    view_idx = next((idx for idx, view in enumerate(page_views_db) if view.id == view_id), None)
    if view_idx is None:
        raise HTTPException(status_code=404, detail="Page view not found")
    
    page_views_db[view_idx].entered_password = True
    return page_views_db[view_idx]

@app.get("/track/pageview", response_model=List[PageView])
async def get_page_views():
    """Get all page views"""
    return page_views_db

@app.delete("/track/campaign/{campaign_id}")
async def reset_campaign(campaign_id: str):
    """Reset tracking data for a specific campaign"""
    global page_views_db
    page_views_db = [view for view in page_views_db if view.campaign_id != campaign_id]
    return {"message": f"Reset tracking data for campaign: {campaign_id}"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)