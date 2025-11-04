from fastapi import FastAPI

app = FastAPI(title="FastApi-app")

@app.get("/")
def read_root():
    return {"message": "Hello"}
