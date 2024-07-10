// import { AuthProvider } from '../components/RouteProtected/AuthContext.jsx';
// import { useState } from 'react'
import './App.css'
import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from './pages/Login/Login.jsx';
import SignUp from './pages/SignUp/signup.jsx';
import Dashboard from './pages/DashBoard/Dashboard.jsx';
import RegistrationDash from './pages/Registration Dashboard/Registration.jsx';
import MainDashboard from './pages/Main Dashboard/MainDash.jsx';
import ProtectedRoute from '../components/RouteProtected/ProtectedRoute.jsx';
import { AuthProvider } from '../components/RouteProtected/AuthContext.jsx';
import FormCase from '../components/PageForm/PageForm.jsx';
import UpdateProfileForm from './pages/Complete Profile/CompleteProfile.jsx';
import FormHeader from '../components/Header/FormHeader.jsx';
import Placement from './pages/Placement/Placement.jsx';
import IntroductionLetter from './pages/Introduction Letter Request/IntroductionLetter.jsx';
import PrintPreview from '../components/Print Layout/Print.jsx';
// import PrintPreviewContainer from '../components/Print Layout/PrintPreview.jsx';
// import RegistrationForm from '../components/Print Form/RegistrationForm.jsx';
// Import all your components here

function App() {
  return (
    <AuthProvider>
      <div className="routes app-container">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path='/register' element={<Dashboard />} />
            <Route path='/registration-portal' element={<RegistrationDash />} />
            <Route path='/dashboard' element={<MainDashboard />} />
            <Route path='/placement' element={<Placement />} />
            <Route path='/introduction-letter' element={<IntroductionLetter />} />
            <Route path='/complete-profile2' element={<FormCase />} />
            <Route path='/complete-profile' element={<UpdateProfileForm />} />
            <Route path='/page_print' element={<PrintPreview />} />
            <Route path='/reghead' element={<FormHeader />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;