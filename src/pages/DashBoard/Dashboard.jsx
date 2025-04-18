import React, { useState } from 'react';
import './dashboard.scss';
import TopNav from '../../../components/Header/Header';
import Empty from '/images/empty_dashboard.png';
import SideBar from '../../../components/Sidebar/Sidebar';
import UserForm from '../../../components/Fill Form/FillForm';
// import MyForm from '../../../components/Form/MyForm';
import MForm from '../../../components/Form/FormData';
import { Helmet } from 'react-helmet';

const Dashboard = (dashboardClass, placementClass, disableCover,disableReg) => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState(null);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Simulating API call for form submission
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          const success = Math.random() > 0.5;
          if (success) {
            resolve({ ok: true });
          } else {
            reject(new Error('Failed to submit form'));
          }
        }, 2000); // Simulating 1 second delay
      });

      if (response.ok) {
      
        setFormData(values); // Store form data in state
        setIsVisible(true); // Show confirmation after successful form submission
      } else {
        /* empty */
      }
    } catch (error) {
      /* empty */
    }
    setSubmitting(false);
  };

  return (
    <div className="route-Dash">
      <Helmet>
        <title>
          ITCC - Registration
        </title>
      </Helmet>
      <SideBar disableCover="dash_navig" dashboardClass="dashy" placementClass="placement" />
      <div className="overlay"></div>
      
      <main>
      <TopNav toggleVisibility={toggleVisibility} isVisible={isVisible} disableReg="registration" setVisible="hide" regVisible="show"/>
        <img src={Empty} alt="Empty dashboard" className="empty_dash" />
        <p className='register_above'> You have no registration record yet. <br/>Click the "Registration" Button above to confirm your registration before proceeding.</p>
      </main>
      <UserForm isVisible={isVisible} onClose={() => setIsVisible(false)} onSubmit={handleSubmit} />
      {formData && <MForm isVisible={!isVisible} onClose={() => setIsVisible(false)} formData={formData} />}
    </div>
  );
};

export default Dashboard;
