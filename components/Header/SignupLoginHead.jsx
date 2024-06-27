import UILogo from "/images/UI_logo.png"

const SignLogHeader = () => {
    return (  <header>
        <h1>INDUSTRIAL TRAINING COORDINATING CENTRE</h1>
        <h3><i>bridging the gap between theory and practical....</i></h3>
        <div className="logo">
          <img src={UILogo} alt="University of Ibadan Logo" />
        </div>
      </header> );
}
 
export default SignLogHeader;