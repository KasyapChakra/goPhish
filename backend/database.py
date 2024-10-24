import motor.motor_asyncio
from dotenv import load_dotenv
import os
import asyncio

load_dotenv()

# Replace with your actual connection string or use environment variable
# MONGO_DETAILS = os.getenv("MONGO_DETAILS")

MONGO_DETAILS = "mongodb+srv://kasychakra:0YPQcRdrnh1k8A9j@cluster0.ec6uc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
db = client['gophish']

