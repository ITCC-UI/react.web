import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Auth = ({ children }) => {
  const token = Cookies.get('token'); // Use js-cookie to get the token

  if (token) {
    return children;
  }
  return <Navigate to="/" />;
};

export default Auth;
