import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './login/login';
import Signup from './signup/signup';
import Home from './home/home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/home" element={<Home/>} />
      </Routes>
    </Router>
  </React.StrictMode>
);
