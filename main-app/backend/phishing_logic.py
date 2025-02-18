from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field, ValidationError
import openai
from aiosmtplib import SMTP
from email.mime.text import MIMEText
from typing import List
from dotenv import load_dotenv
import os
import random

load_dotenv()

# OpenAI API key (Replace with your actual API key)
openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter()

# Pydantic model for participant data
class Participant(BaseModel):
    name: str
    email: str

# Pydantic model for the request body
class CampaignRequest(BaseModel):
    participants: List[Participant]
    additional_context: str = Field("", description="Optional additional context")

# FastAPI route for creating a phishing campaign
@router.post("/create_campaign")
async def create_campaign(request: CampaignRequest):
    # Iterate through participants and generate a phishing email for each
    for participant in request.participants:
        email_content = await generate_phishing_email(participant.name, request.additional_context)
        
        # Send the email using the SMTP service
        await send_email(participant.email, email_content)

    return {"status": "success", "message": "Phishing emails sent successfully"}

# Function to generate a phishing email using OpenAI
async def generate_phishing_email(participant_name: str, additional_context: str) -> str:
    # Construct the prompt for OpenAI with additional context
    print("NAME IS ", participant_name, "CONTEXT IS ", additional_context)
    messages = [
        {"role": "system", "content": "You are a helpful assistant that specializes in generating phishing emails for security testing."},
        {"role": "user", "content": f"Write a phishing email to {participant_name}. The email should look like it's from the University of Pennsylvannia, and should be telling the user that they need to purchase their technology bundle because its a very good deal. Address the person by name. DO NOT INCLUDE A SUBJECT LINE, AND ONLY INCLUDE THE CONTENT OF THE EMAIL, NOTHING ELSE EXPLAINING IT OR ANYTHING ELSE. DO NOT INCLUDE A LINK, I WILL ADD IT MYSELF. Here is some additional context, apply it if its there: {additional_context}"}
    ]

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # You can change this to "gpt-4" or another available model
            messages=messages,
            max_tokens=150
        )
        print("RESP IS ", response)
        return response.choices[0].message['content'].strip()
    except Exception as e:
        print("THIS ERROR ", e)
        raise HTTPException(status_code=500, detail="Failed to generate phishing email")

async def send_email(to_email: str, email_body: str):
    print(f"GOT TO SEND WITH TO EMAIL: {to_email} AND BODY: {email_body}")

    email_body += "\n\nHere is the link to purchase: https://gophish-1-xrnl.onrender.com/"

    subject_options = [
        "Urgent: Action Required!",
        "Action Required: Time-Sensitive!",
    ]
    
    subject = random.choice(subject_options)

    message = MIMEText(email_body)
    message["From"] = os.getenv("GMAIL_USER")  # Get the Gmail user from environment
    message["To"] = to_email
    message["Subject"] = subject

    # Connect to the Gmail SMTP server
    try:
        async with SMTP(hostname="smtp.gmail.com", port=587, start_tls=True) as smtp:
            # Log in using the Gmail credentials stored in environment variables
            await smtp.login(os.getenv("GMAIL_USER"), os.getenv("GMAIL_APP_PASSWORD"))
            await smtp.send_message(message)
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send email to {to_email}")