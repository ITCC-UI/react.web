import React from 'react';
import Modal from 'react-modal';
import './FullScreenSuccessMessage.scss';
import Ticked from "/images/ticked.png"


Modal.setAppElement('#root');

const FullScreenSuccessMessage = ({ isOpen, message, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Success Message"
      className="fullScreenModal"
      overlayClassName="fullScreenOverlay"
    >
      <div className="successContent">
        {/* <AiOutlineCheckCircle size={100} color="#4CAF50" /> */}
        <img src={Ticked} alt="" srcset="" />
        {/* <h2>{message}</h2> */}
        <div className="successMessage">
        Submitted successfully!
        </div>

        <div className="successMessageContent">
      {message}
        </div>
        <button onClick={onClose}>Close</button>
      </div>


      
    </Modal>
  );
};

export default FullScreenSuccessMessage;