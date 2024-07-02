// import { useState } from 'react'
import './App.css'
import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from './pages/Login/Login.jsx';
import SignUp from './pages/SignUp/signup.jsx';
import Dashboard from './pages/DashBoard/Dashboard.jsx';
import UpdateProfile from '../components/Form/FormData.jsx';
import RegistrationDash from './pages/Registration Dashboard/Registration.jsx';
import ConfamForm from '../components/Confirmation Form/ConfamForm.jsx';
import MainDashboard from './pages/Main Dashboard/MainDash.jsx';
import PieC from '../Random components/Piechart.jsx';
import TVariant from '../components/TimelineShow/TimeVariationComp.jsx';
import CompleteProfile from './pages/Complete Profile/CompleteProfile.jsx';
import ProtectedRoute from '../components/RouteProtected/ProtectedRoute.jsx';
import { AuthProvider } from '../components/RouteProtected/AuthContext.jsx';
import MyForm from '../components/Form/FormData.jsx';
import FormCase from '../components/PageForm/PageForm.jsx';
import CombinedForm from './pages/Complete Profile/Combined.jsx';
import UpdateProfileForm from './pages/Complete Profile/CompleteProfile.jsx';
import FormHeader from '../components/Header/FormHeader.jsx';
function App() {
    return (

      <div className="routes app-container">
    <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path='/register' element={<Dashboard/>}></Route>
       <Route path='/registration-portal' element= {<RegistrationDash/>}></Route>
          <Route path='/dashboard' element={<MainDashboard/>  } />
               
               
               {/* <Route path="/form" element={<UpdateProfile />} /> */}
          {/* <Route path='/complete-profile' element ={<CompleteProfile />}></Route> */}
{/* <Route path='/complete-profile' element={<CombinedForm/>} /> */}
       <Route path='/complete-profile2' element={<FormCase/>}/>
        <Route path='/complete-profile' element={<UpdateProfileForm/>}/>
      <Route path='/reghead' element ={<FormHeader/>}/>
        </Routes>
   

        
      </div>
  )

}

export default App
