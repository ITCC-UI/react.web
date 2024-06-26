import UILogo from "/images/UI_logo.png"
import "./styler.scss"
const FormHeader = () => {
    return ( <div className="headerForm">

        <div className="headerContainer">
            <img src={UILogo} alt="UI Logo" />
            Profile Information
        </div>
    </div> );
}
 
export default FormHeader;