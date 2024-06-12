
import cv2
import pywt
import torch
from torch import nn
from torchvision import transforms
import numpy as np


# Fourier:
def aplicar_janela_hann(imagem):
    linhas, colunas = imagem.shape[:2]
    hann_vertical = np.hanning(linhas) # Criar a janela de Hann
    hann_horizontal = np.hanning(colunas)
    janela_2d = hann_vertical[:, np.newaxis] * hann_horizontal # Aplicar a janela à imagem
    imagem_janelada = imagem * janela_2d # Multiplicar a imagem pela janela
    return imagem_janelada

def aplicar_transformada_fourier(imagem):
    imagem = cv2.resize(imagem, dsize=(224, 224))
    imagem = aplicar_janela_hann(imagem)
    transformada_fourier = np.fft.fft2(imagem) # Calcular a transformada de Fourier 2D
    transformada_fourier_deslocada = np.fft.fftshift(transformada_fourier) # Mover o componente de baixa frequência para o centro
    espectro_magnitude = np.log(np.abs(transformada_fourier_deslocada) + 1) # Calcular o espectro de magnitude (log para melhor visualização)
    espectro_magnitude = cv2.resize(espectro_magnitude, dsize=(120, 120))
    return espectro_magnitude

# Haar:
def aplicar_transformada_haar_merged(imagem):
    coeffs = pywt.wavedec2(imagem, 'haar', level=2)
    cA2, (cH2, cV2, cD2), (cH1, cV1, cD1) = coeffs
    imagem_reconstruida = pywt.waverec2(coeffs, 'haar')
    merged = cv2.add(cH2, cV2)
    merged = cv2.resize(merged, dsize=(120, 120))
    return merged

# Transform
def toTensor(image):
    return torch.tensor(image, dtype=torch.float32)

transform = transforms.Compose([
    aplicar_transformada_fourier,
    #aplicar_transformada_haar_merged,
    toTensor,
])

class CNN(nn.Module):
    def __init__(self):
        super(CNN, self).__init__()
        self.convnet = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3,padding=1), nn.ReLU(),
            nn.Conv2d(32, 32, kernel_size=3,padding=1), nn.ReLU(),
            nn.MaxPool2d(2, 2),
            
            nn.Conv2d(32, 64, kernel_size=3,padding=1), nn.ReLU(),
            nn.MaxPool2d(2, 2),
            
            nn.Conv2d(64, 128, kernel_size=3,padding=1), nn.ReLU(),
            nn.MaxPool2d(2, 2),
            
            nn.Flatten()
        )
        
        self.fc = nn.Sequential(
            nn.Linear(28800, 1024),
            nn.ReLU(),
            nn.Dropout(),
            nn.BatchNorm1d(1024),
            
            nn.Linear(1024, 512),
            nn.ReLU(),
            nn.Dropout(),
            nn.BatchNorm1d(512),
            
            nn.Linear(512, 3),
        )

    def forward(self, x):
        x = self.convnet(x)
        x = self.fc(x)
        return x

    def get_embedding(self, x):
        return self.forward(x)

def get_model(path):
    model = CNN().to("cuda")
    model.load_state_dict(torch.load(path, map_location=torch.device('cuda')))
    return model

def make_inference(model, image):
    image_data = image.file.read()
    img = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_UNCHANGED)
    if img.shape[2] == 4: # Caso o shape da imagem possua 4 canais, remover o canal alpha
        img = cv2.cvtColor(img, cv2.COLOR_BGRA2RGB)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) 
    transformed = torch.tensor(transform(img).unsqueeze(0).unsqueeze(0)).cuda()
    output = model(transformed)
    _, predicted = output.max(1)
    return str(predicted.item())