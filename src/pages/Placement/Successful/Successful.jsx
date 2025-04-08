import React from 'react';
import Modal from 'react-modal';
import './FullScreenSuccessMessage.scss';
import Ticked from "/images/ticked.png";
import { motion } from 'framer-motion';



Modal.setAppElement('#root');

const FullScreenSuccessMessage = ({ isOpen, title = "Submitted successfully!", message, onClose, refresh }) => {

  
  const handleClose = () => {
 window.location.reload()
}
  


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Success Message"
      className="fullScreenModal"
      overlayClassName="fullScreenOverlay"
    >
      <div className="successContent">
        <motion.img 
          src={Ticked} 
          alt="Success tick icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        />
        <div className="successMessage">
          {title}
        </div>

        <div className="successMessageContent">
          {message}
        </div>
        <button onClick={() => { onClose(); handleClose() }}>Close</button>
      </div>
    </Modal>
  );
};

export default FullScreenSuccessMessage;
