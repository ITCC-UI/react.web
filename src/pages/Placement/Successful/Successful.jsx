import React from 'react';
import Modal from 'react-modal';
import { AiOutlineCheckCircle } from "react-icons/ai";
import './FullScreenSuccessMessage.scss';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
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
        <AiOutlineCheckCircle size={100} color="#4CAF50" />
        <h2>{message}</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

export default FullScreenSuccessMessage;