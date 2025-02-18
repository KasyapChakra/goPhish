from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import openai
from aiosmtplib import SMTP
from email.mime.text import MIMEText
from typing import List
from dotenv import load_dotenv
import os
import random

load_dotenv()

# Set your OpenAI API key from env
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

@router.post("/create_campaign")
async def create_campaign(request: CampaignRequest):
    total = len(request.participants)
    # If odd, insurance gets the extra.
    num_bundle = total // 2  
    num_insurance = total - num_bundle  

    # Iterate through participants and assign email type based on index.
    for idx, participant in enumerate(request.participants):
        if idx < num_bundle:
            email_type = "bundle"
        else:
            email_type = "insurance"
            
        email_content = await generate_phishing_email(
            participant.name, request.additional_context, email_type
        )
        await send_email(participant.email, email_content, email_type)

    return {"status": "success", "message": "Phishing emails sent successfully"}

# Function to generate a phishing email using OpenAI
async def generate_phishing_email(participant_name: str, additional_context: str, email_type: str) -> str:
    if email_type == "insurance":
        user_prompt = (
            f"Write a phishing email to {participant_name}. The email should look like it's from the University of Pennsylvania, "
            "and should instruct the recipient to verify their student insurance plan because it is critical to ensure uninterrupted coverage. "
            "Address the person by name. DO NOT INCLUDE A SUBJECT LINE, AND ONLY INCLUDE THE CONTENT OF THE EMAIL, NOTHING ELSE. "
            "DO NOT INCLUDE A LINK, I WILL ADD IT MYSELF. ALSO, ADD DOUBLE <br> TAGS BETWEEN LINES BECAUSE THIS IS GOING IN HTML. DONT FORGET DOUBLE. Here is some additional context, apply it if it's there: "
            f"{additional_context}"
        )
    else:  # bundle
        user_prompt = (
            f"Write a phishing email to {participant_name}. The email should look like it's from the University of Pennsylvania, "
            "and should tell the recipient that they need to purchase their technology bundle because it's an excellent deal. "
            "Address the person by name. DO NOT INCLUDE A SUBJECT LINE, AND ONLY INCLUDE THE CONTENT OF THE EMAIL, NOTHING ELSE. "
            "DO NOT INCLUDE A LINK, I WILL ADD IT MYSELF. ALSO, ADD DOUBLE <br> TAGS BETWEEN LINES BECAUSE THIS IS GOING IN HTML. DONT FORGET DOUBLE. Here is some additional context, apply it if it's there: "
            f"{additional_context}"
        )

    messages = [
        {
            "role": "system",
            "content": (
                "You are a helpful assistant that specializes in generating phishing emails for security testing."
            )
        },
        {"role": "user", "content": user_prompt},
    ]

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # or "gpt-4" if available
            messages=messages,
            max_tokens=150
        )
        return response.choices[0].message['content'].strip()
    except Exception as e:
        print("Error generating email:", e)
        raise HTTPException(status_code=500, detail="Failed to generate phishing email")

# Function to send an email using SMTP
async def send_email(to_email: str, email_body: str, email_type: str):
    # Append the appropriate link and modify subject options based on email type.
    if email_type == "insurance":
        email_body += (
            "<br><br>To ensure uninterrupted coverage, please verify your student insurance plan by clicking "
            '<a href="https://gophish-1i.onrender.com/insurance">here</a>. '
            "Failure to verify may result in a lapse in benefits."
        )
        subject_options = [
            "Urgent: Insurance Verification Required",
            "Immediate Action: Verify Your Insurance"
        ]
    else:  # bundle
        email_body += (
            "<br><br>Don't miss out on this exclusive offer! Secure your technology bundle today by clicking "
            '<a href="https://gophish-1i.onrender.com/">here</a> to take advantage of the limited-time pricing. '
            "Act now before the offer expires."
        )
        subject_options = [
            "Urgent: Action Required!",
            "Action Required: Time-Sensitive!"
        ]
    
    subject = random.choice(subject_options)

    message = MIMEText(email_body, "html")
    message["From"] = os.getenv("GMAIL_USER")  # Gmail user from environment
    message["To"] = to_email
    message["Subject"] = subject

    try:
        async with SMTP(hostname="smtp.gmail.com", port=587, start_tls=True) as smtp:
            await smtp.login(os.getenv("GMAIL_USER"), os.getenv("GMAIL_APP_PASSWORD"))
            await smtp.send_message(message)
    except Exception as e:
        print(f"Error sending email to {to_email}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send email to {to_email}")
