const NormalButton = ({ registerSelf, onButtonClick, buttonText = "Register" }) => {
    return (
      <button className={registerSelf} onClick={onButtonClick}>
        {buttonText}
      </button>
    );
  }
 
export default NormalButton;