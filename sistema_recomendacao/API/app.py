
import torch
from utils import get_model, make_inference

from fastapi import FastAPI, UploadFile, Response
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

#CORS, para permitir requisições de outros domínios
origins = [
    "*",
    # "http://localhost:5173", #Frontend do React
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_path = "./model-fourier-augmentation.pth"
model = get_model(model_path)
model.eval()

CLASSES = ["Desfocada", "Movimento", "Nítida"]

@app.get('/', response_class=HTMLResponse)
def home():
    return '<h1>API de Recomendacao</h1>'

# @app.post('/pp')
# def test(name: str) -> str:
#     return "hello"+name

@app.post('/getpred')
def read_cropped(image: UploadFile) -> str:
    index = make_inference(model, image)
    return CLASSES[int(index)]


if __name__ == '__main__':
    import uvicorn
    print("rodando")
    uvicorn.run('app:app', host='127.0.0.1', port=8080, log_level='info')