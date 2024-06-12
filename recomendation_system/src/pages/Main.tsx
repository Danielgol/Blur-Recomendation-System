import React from 'react';
import { useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

import './main.css';

const Main: React.FC = () => {
    
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
    };

    const handleStartClick = () => {
        navigate("/cnn", { state: { email } });
    };

    return (
        <div>
        <div className="container">
          <h1>Sistema de Recomendação</h1>
          <p>Leia as instruções e clique no botão abaixo para iniciar o experimento</p>
          <div className="flex flex-row ">
            <input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={handleEmailChange}
                className="email-input"
            />
            <button style={{marginLeft: "-15%"}} onClick={handleStartClick} className="start-button">Iniciar</button>
          </div>
          <p>Esta atividade terá a duração de 30 minutos</p>
          <div className="instructions">
            <ol>
              <li><span style={{color: "#000000", fontWeight: "bold"}}>1º - </span> Observe e analise a imagem;</li>
              <li><span style={{color: "#000000", fontWeight: "bold"}}>2º - </span> Ao lado da imagem, verifique qual a recomendação do tipo de classificação;</li>
              <li>
              <span style={{color: "#000000", fontWeight: "bold"}}>3º - </span> Se concordar com a descrição recomendada:
                <ul>
                  <li>clique em uma das opções com a descrição da classificação recomendada.</li>
                </ul>
                Se não concordar com a descrição recomendada:
                <ul>
                  <li>faça sua própria escolha, clicando em uma das opções com a classificação escolhida.</li>
                </ul>
              </li>
              <li><span style={{color: "#000000", fontWeight: "bold"}}>4º - </span> Clique no botão CONFIRMAR para finalizar a análise da primeira imagem;</li>
            </ol>
            <p>
              Após a confirmação, uma nova imagem será exibida automaticamente, e o procedimento de análise e
              classificação deverá ser repetido até que o tempo total do experimento seja concluído.
            </p>
            <p>
              As opções de classificação das imagens são: Nítida, Desfocada e Movimento. Os tipos de classificações das falhas já foram explicadas a todos os participantes do experimento durante as instruções iniciais.
            </p>
          </div>
        </div>
        </div>
      );
};

export default Main;

