from fastapi import FastAPI
from auth import router as auth_router
from phishing_logic import router as phishing_campaign_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Include authentication routes
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(phishing_campaign_router, prefix="/campaign", tags=["campaign"])



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)