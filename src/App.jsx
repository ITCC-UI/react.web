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
import Placement from './pages/Placement/Placement.jsx';
import IntroductionLetter from './pages/Introduction Letter Request/IntroductionLetter.jsx';
import PrintPreview from '../components/Print Layout/Print.jsx';
import ErrorPage from './pages/WildCard/WildPage.jsx';
import Auth from "./Auth.jsx"
import UpdatePassword from './pages/Password Reset/reset_password.jsx';
import ResetPassword from './pages/Password Reset/NewPassword.jsx';
// import DailyLogs from './pages/Logs/logs.jsx';
import MoreDetails from '../components/View More/MoreDetailsAcceptance.jsx';
import ChangePlacementForm from '../components/View More/NewForm.jsx';
import MultiStepForm from '../components/View More/NewForm.jsx';
// import PrintPreviewContainer from '../components/Print Layout/PrintPreview.jsx';
// import RegistrationForm from '../components/Print Form/RegistrationForm.jsx';
import JobReportingForm from './pages/Job Reporting Form/JobReportMain.jsx';
function App() {

    return (
      <div className="routes app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/password_reset' element={<UpdatePassword/>} />
          <Route path='/new-password' element={<ResetPassword/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path='/register' element={<Auth><Dashboard/></Auth>}></Route>
          <Route path='/registration-portal' element= {<Auth><RegistrationDash/></Auth>}></Route>
          <Route path='/dashboar' element={<Auth><MainDashboard/></Auth>  } />
          {/* <Route path='/job-reporting-form' element={<Auth><JobReportingForm/></Auth>  } /> */}
          <Route path='/placement' element={<Auth><Placement/></Auth>} />               
          <Route path='/introduction-letter' element={<Auth><IntroductionLetter/></Auth>} /> 
          <Route path='/complete-profile2' element={<Auth><FormCase/></Auth>}/>
          <Route path='/complete-profile' element={<Auth><UpdateProfileForm/></Auth>}/>
          <Route path='/page_print/:registrationId' element={<Auth><PrintPreview/></Auth>}/>
          <Route path='*' element={<Auth><ErrorPage/></Auth>}/>
          {/* <Route path='/logs' element={<DailyLogs />} /> */}
          <Route path='/details' element={<MoreDetails />} />
          <Route path='/form' element={<MultiStepForm/>}></Route>
          
        </Routes>        
      </div>
  )

}

export default App
