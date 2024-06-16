// import { useState } from 'react'
import './App.css'
import React from 'react';
import {Routes, Route} from "react-router-dom";
import Login from './pages/Login/Login.jsx';
import SignUp from './pages/SignUp/signup.jsx';
import Dashboard from './pages/DashBoard/Dashboard.jsx';
import UpdateProfile from '../components/Form/FormData.jsx';

function App() {
    return (

      <div className="routes app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/form" element={<UpdateProfile />} />
          <Route path='/' element={<Dashboard/>}></Route>

        </Routes>
        
      </div>
  )
}

export default App
