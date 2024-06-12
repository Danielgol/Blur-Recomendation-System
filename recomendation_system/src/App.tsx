import * as React from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import Main from "./pages/Main";
import Inference from "./pages/Inference";
import Classifier from "./pages/Classifier";
import Fim from "./pages/Fim";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/cnn" element={<Classifier />} />
          <Route path="/fim" element={<Fim />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
