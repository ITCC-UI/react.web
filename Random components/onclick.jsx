import React, { useState } from 'react';
import styles from './header.module.scss'; // Assuming CSS Modules

const MyModule = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`${styles.baseStyle} ${isActive ? styles.active : ''}`} onClick={toggleActive}>
      Click Me
    </div>
  );
};

export default MyModule;
