import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import StartPage from './StartPage.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
// import App from "./app";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/start" element={<StartPage />} />
      <Route path="/main" element={<App />} />
    </Routes>
  </BrowserRouter>
);