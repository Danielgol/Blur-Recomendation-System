import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate, useLocation  } from "react-router-dom";
import Button from "../components/Button";
import callAPI from "../actions/callAPI";
import './classifier.css';

// Listar todas as imagens (pasta public do projeto react):
const imagePaths = [
    'images/000000000285.jpg',
    'images/000000000885.jpg',
    'images/000000002685.jpg', 
    'images/000000014007.jpg',
    'images/000000000724.jpg', 
    'images/000000001584.jpg', 
    'images/000000003501.jpg', 
    'images/000000015079.jpg',
    'images/000000000872.jpg', 
    'images/000000002006.jpg', 
    'images/000000013201.jpg', 
    'images/000000015254.jpg'
];

const formatTime = (seconds: any) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const paddedSeconds = remainingSeconds.toString().padStart(2, '0');
  return `${minutes}:${paddedSeconds}`;
};




function App() {

  const location = useLocation();
  const { email } = location.state || {};
  const [selectedOption, setSelectedOption] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [responseAPI, setResponseAPI] = useState("");
  const [markeds, setMarkeds] = useState([]);

  const maxTime = 1800*1000;
  const [timeRemaining, setTimeRemaining] = useState(maxTime/1000);

  const navigate = useNavigate();
  const handleBackHome = () => {
    navigate("/");
  };

  useEffect(() => {
    sendImageToAPI(imagePaths[currentImageIndex])

    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    const timer = setTimeout(handleTimeout, maxTime);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    }
  }, []);





  const handleTimeout = () => {
    alert('30 minutos se passaram!');
    save_data();
    navigate("/fim");
  };

  const handleOptionChange = (e: any) => {
    setSelectedOption(e.target.value);
  };

  async function sendImageToAPI(file: any) {
    const response = await fetch(file);
    if (!response.ok) {
        throw new Error('Erro ao buscar a imagem');
    }
    const blob = await response.blob();
    const result = await callAPI(blob);
    setResponseAPI(result.data);
  };

  const save_data = () => {
    const jsonData = {
      email: email,
      array: markeds,
    };
    
    const jsonString = JSON.stringify(jsonData);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    link.click();
    navigate("/fim");
  };

  const handleConfirmClick = () => {
    if (selectedOption === ''){
      alert("Selecione uma opção para continuar!")
      return
    }
    const obj = {"img": imagePaths[currentImageIndex], "api_response": responseAPI, "marked": selectedOption}
    const new_markeds: any = [...markeds, obj]
    setMarkeds(new_markeds)
    if (currentImageIndex < imagePaths.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
        sendImageToAPI(imagePaths[currentImageIndex + 1]);
        setSelectedOption('');
    } else {
      alert('Você analisou todas as imagens.');
      save_data();
    }
  };

  // const handleBackClick = () => {
  //   if (currentImageIndex - 1 >= 0) {
  //       setCurrentImageIndex(currentImageIndex - 1);
  //       sendImageToAPI(imagePaths[currentImageIndex - 1])
  //       setSelectedOption('')
  //   } else {
  //     alert('Você já chegou ao início da lista.');
  //   }
  // };

  return (
    <div className="bg-gray-200 w-screen h-screen flex flex-col justify-center items-center overflow-hidden">
        <Button onClick={handleBackHome} className="absolute top-4 left-4">
            Voltar
        </Button>
      <p>Tempo restante: {formatTime(timeRemaining)} minutos</p>
      <div className="containerCl">
        <div className="image-container">
          <div className="image-header">
            <span>{imagePaths[currentImageIndex]}</span>
          </div>
          <div className="image-placeholder">
            <img src={imagePaths[currentImageIndex]} alt={`Imagem ${currentImageIndex + 1}`}
              style={{width: '600px', height: '600px', objectFit: 'fill'}} />
          </div>
        </div>
        <div className="recommendation-container">
          <h3>Recomendação:</h3>
          <p style={{ width: '300px', border: '1px solid black', }} className="recommendation-text">Falha do tipo <span className="highlight">{responseAPI}</span></p>
          <form>
            <div>
              <input
                type="radio"
                id="nitida"
                name="classification"
                value="Nítida"
                checked={selectedOption === 'Nítida'}
                onChange={handleOptionChange}
              />
              <label htmlFor="nitida">Nítida</label>
            </div>
            <div>
              <input
                type="radio"
                id="desfocada"
                name="classification"
                value="Desfocada"
                checked={selectedOption === 'Desfocada'}
                onChange={handleOptionChange}
              />
              <label htmlFor="desfocada">Desfocada</label>
            </div>
            <div>
              <input
                type="radio"
                id="movimento"
                name="classification"
                value="Movimento"
                checked={selectedOption === 'Movimento'}
                onChange={handleOptionChange}
              />
              <label htmlFor="movimento">Movimento</label>
            </div>
          </form>
          <button className="confirm-button" onClick={handleConfirmClick}>Confirmar</button>
          {/* <div className="flex flex-row">
            <div style={{padding: "0 10px"}}>
              <button className="back-button" onClick={handleBackClick}>Voltar</button>
            </div>
            <div>
              <button className="confirm-button" onClick={handleConfirmClick}>Avançar</button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
