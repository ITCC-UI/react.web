import React from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCloseCircle } from "react-icons/ai";
import './FullScreenFailureMessage.scss';

Modal.setAppElement('#root');

const FullScreenFailureMessage2 = ({ isOpen, message, onClose }) => {

  const navigation = useNavigate();
  const handleRefresh = () => {
    navigation(0); // Refresh the page
  };
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
        {/* <button onClick={() => { handleRefresh(); onClose(); }}>Close</button> */}
        <button onClick={() => {onClose(); }}>Close</button>
        
      </div>
    </Modal>
  );
};

export default FullScreenFailureMessage2;