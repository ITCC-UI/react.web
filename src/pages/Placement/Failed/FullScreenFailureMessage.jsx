import React from 'react';
import Modal from 'react-modal';
import { AiOutlineCloseCircle } from "react-icons/ai";
import './FullScreenFailureMessage.scss';

Modal.setAppElement('#root');

const FullScreenFailureMessage = ({ isOpen, message, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Failure Message"
      className="fullScreenModal"
      overlayClassName="fullScreenOverlay"
    >
      <div className="failureContent">
        <AiOutlineCloseCircle size={100} color="#FF0000" />
        <h2>{message}</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

export default FullScreenFailureMessage;