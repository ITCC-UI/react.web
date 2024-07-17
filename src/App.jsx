// import { useState } from 'react'
import './App.css'
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
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
// import PrintPreviewContainer from '../components/Print Layout/PrintPreview.jsx';
// import RegistrationForm from '../components/Print Form/RegistrationForm.jsx';
function App() {

    return (

      <div className="routes app-container">
    <Routes>
          <Route path="/ims" element={<Login />} />
          <Route path="/ims/login" element={<Login />} />
          <Route path="/ims/signup" element={<SignUp />} />
          <Route path='/ims/register' element={<Dashboard/>}></Route>
       <Route path='/ims/registration-portal' element= {<RegistrationDash/>}></Route>
          <Route path='/ims/dashboard' element={<MainDashboard/>  } />
          <Route path='/ims/placement' element={<Placement/>} />
         
               
              {/* <Route path='/ims/introduction-letter' element={<IntroductionLetter/>} />  */}
           
       <Route path='/ims/complete-profile2' element={<FormCase/>}/>
        <Route path='/ims/complete-profile' element={<UpdateProfileForm/>}/>

        <Route path='/ims/page_print/:registrationId' element={<PrintPreview/>}/>
      <Route path='/ims/reghead' element ={<FormHeader/>}/>

      <Route path='/ims/*' element={<ErrorPage/>}/>
        </Routes>
   

        
      </div>
  )

}

export default App
