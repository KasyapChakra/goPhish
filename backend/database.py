import motor.motor_asyncio
from dotenv import load_dotenv
import os

load_dotenv()

# Replace with your actual connection string
MONGO_DETAILS = os.getenv("MONGO_DETAILS")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
db = client['gophish']