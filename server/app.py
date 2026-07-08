from fastapi import FastAPI

app = FastAPI(
    title="Viettel Store AI"
)

@app.get("/")
def read_root():
    return {"Hello": "World"}
