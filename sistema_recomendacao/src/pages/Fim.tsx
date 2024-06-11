import React from 'react';
import { useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

import './main.css';

const Fim: React.FC = () => {
    
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
    };

    const handleClick = () => {
        navigate("/");
    };

    return (
      <div>
        <div>
          <h1>Fim da Atividade, Obrigado!</h1>
          <div className="flex flex-row">
            <button onClick={handleClick} className="start-button">Voltar para o Menu</button>
          </div>
        </div>
      </div>
    );
};

export default Fim;

