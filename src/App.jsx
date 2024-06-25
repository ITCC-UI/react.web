// import { useState } from 'react'
import './App.css'
import React from 'react';
import {Routes, Route} from "react-router-dom";
import Login from './pages/Login/Login.jsx';
import SignUp from './pages/SignUp/signup.jsx';
import Dashboard from './pages/DashBoard/Dashboard.jsx';
import UpdateProfile from '../components/Form/FormData.jsx';
import RegistrationDash from './pages/Registration Dashboard/Registration.jsx';
import ConfamForm from '../components/Confirmation Form/ConfamForm.jsx';
import MainDashboard from './pages/Main Dashboard/MainDash.jsx';
import Placement from './pages/Placement/Placement.jsx';
import IntroLetter from './pages/Pre Training/IntroLetter.jsx';


function App() {
    return (

      <div className="routes app-container">
        <Routes>
          <Route path='/' element={<Dashboard/>}></Route>
          {/* <Route index element={<Dashboard/>}></Route> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/form" element={<UpdateProfile />} />
          <Route path='/registration_portal' element= {<RegistrationDash/>}></Route>
          <Route path='/userform' element={<ConfamForm/>} />
          <Route path='/dashboard' element={<MainDashboard/>} />
          <Route path='/placement' element={<Placement/>} />
          <Route path='/companies' element={<Placement/>} />
          <Route path='/introduction-letter' element={<IntroLetter/>} />
          <Route path='/job-reporting-form' element={<Placement/>} />
          <Route path='/daily-logs' element={<Placement/>} />
          <Route path='/new-logbook-request' element={<Placement/>} />
          <Route path='/submit-training-document' element={<Placement/>} />
          <Route path='/results' element={<Placement/>} />
          <Route path='*' element={<div>Not Found!</div>} />

        </Routes>      
      </div>
  )

}

export default App
