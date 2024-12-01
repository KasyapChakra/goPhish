from passlib.context import CryptContext
from database import db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

async def get_user_by_username(username: str):
    user = await db.users.find_one({"username": username})
    return user

async def create_user(user):
    user_dict = user.dict()
    user_dict["password"] = get_password_hash(user_dict["password"])
    await db.users.insert_one(user_dict)
    return user_dict