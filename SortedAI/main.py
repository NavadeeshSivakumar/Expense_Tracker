from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import insights, chat, parser
import json

app = FastAPI(title="Sorted AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(insights.router)
app.include_router(chat.router)
app.include_router(parser.router)

@app.get("/health")
def health():
    return {"status": "ok", "service": "Sorted AI"}