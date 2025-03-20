from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
import json
import asyncio
import os
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

OLLAMA_API_URL = os.getenv("OLLAMA_API_URL")
CORS_ORIGINS = os.getenv("CORS_ORIGINS").split(",")

MODEL = os.getenv("MODEL")


app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    model: str = MODEL
    stream: bool = True

@app.post("/api/chat")
async def chat(request: ChatRequest):
    
    async def generate():
        async with httpx.AsyncClient(timeout=None) as client:
            ollama_request = {
                "model": MODEL,
                "prompt": " ".join([msg.content for msg in request.messages]),
                "stream": True,
            }
            
            async with client.stream("POST", OLLAMA_API_URL, json=ollama_request, headers={"ngrok-skip-browser": "true"}) as response:
                async for chunk in response.aiter_text():
                    try:
                        data = json.loads(chunk)
                        if "response" in data:
                            yield f"data: {json.dumps({'text': data['response']})}\n\n"
                        if data.get("done", False):
                            yield f"data: {json.dumps({'done': True})}\n\n"
                    except json.JSONDecodeError:
                        continue
                
    return StreamingResponse(generate(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT"))
    host = os.environ.get("HOST")
    uvicorn.run(app, host=host, port=port) 