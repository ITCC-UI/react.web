import React from "react";
import { Link } from "react-router-dom";
import Pen from "/images/pen.png"
const Button = ({toggleVisibility}) => {
    return (  <div className="registration">
        <Link to ="/form"><button>
          <img
            src={Pen}
            alt="Pen"
          />
          Registration
        </button>
        </Link>
      </div> );
}
 
export default Button;