import React, { useState } from "react";
import "./lettersidebar.scss"

const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
};


const LetterSidebar = ({sidebarData, setSidebarVisible}) => {
    const a = "lorem ipsum dolor Hmmm… can't reach this pagewww.bing.com’s server IP address could not be found."
    return (
        <div className="statusComponent">
            <div><h3 onClick={() => setSidebarVisible((prev) => { !prev })}>&#215;</h3></div>
            <div>
                <p>COMPANY NAME</p>
                <h5>{sidebarData.name}</h5>
                <p>ADDRESS TO</p>
                {/* <h5>{sidebarData.address}</h5> */}
                <p>COMPANY ADDRESS</p>
                <h5>University of Ibadan</h5>
                <p>DATE OF REQUEST</p>
                <h5>{new Date().toLocaleString('en-US', options) + "."}</h5>
                <p>APPROVAL STATUS</p>
                {/* <h5>{sidebarData.status}</h5> */}
                <p>APPROVER'S COMMENT</p>
                <h5>{a}{a}{a}</h5>
                <p>APPROVAL DATE</p>
                <h5>{new Date().toLocaleString('en-US', options) + "."}</h5>
            </div>
        </div>
    )
}
export default LetterSidebar;