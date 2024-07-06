import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NetworkStatusIcon = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('You are online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You are offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial network status
    if (!navigator.onLine) {
      toast.error('You are offline');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div>
      <FontAwesomeIcon
        icon={isOnline ? faWifi : faExclamationTriangle}
        style={{ color: isOnline ? 'green' : 'red', fontSize: '1em' }}
        fade={true}
      />
    </div>
  );
};

export default NetworkStatusIcon;
