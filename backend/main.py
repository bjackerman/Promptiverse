from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import prompts, styles
from app.database import db

app = FastAPI(title="GenAI Prompt Repo API")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prompts.router, prefix="/api/prompts", tags=["prompts"])
app.include_router(styles.router, prefix="/api/styles", tags=["styles"])

@app.get("/")
async def root():
    return {"message": "Welcome to GenAI Prompt Repo API"}
