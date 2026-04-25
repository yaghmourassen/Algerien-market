from fastapi import FastAPI

app = FastAPI(title="Recommendation Service")

@app.get("/")
def home():
    return {"message": "Recommendation Service is running 🚀"}