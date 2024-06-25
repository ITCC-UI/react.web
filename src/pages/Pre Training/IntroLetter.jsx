import React, { useState } from "react";
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
import "./introductionletter.scss"

const IntroLetter = () => {
    const [statusVisible, setStatusVisible] =  useState(true)

    const LetterStatus = () => {
        const a = "Lorem"
        return(
            <div className="statusComponent">
                <div><h3 onClick={() => setStatusVisible((prev) => {!prev})}>&#215;</h3></div>
                <div>
                    <p>COMPANY NAME</p>
                    <h5>{a}</h5>
                    <p>ADDRESS TO</p>
                    <h5>{a}</h5>
                    <p>COMPANY ADDRESS</p>
                    <h5>{a}</h5>
                    <p>DATE OF REQUEST</p>
                    <h5>{a}</h5>
                    <p>APPROVAL STATUS</p>
                    <h5>{a}</h5>
                    <p>APPROVER'S COMMENT</p>
                    <h5>{a}</h5>
                    <p>APPROVAL DATE</p>
                    <h5>{a}</h5>
                </div>
            </div>
        )
    }
    return (
        <>
        <div className="placement route-Dash">
            <SideBar dashboardClass={"active dashy"} placementClass={"placement"}/>
            <main>
            <TopNav disableReg={"registration disable"}/>

            <div className="introComponent entireContainer">
                <div className="header">
                    <h4 className="title">INTRODUCTION  LETTERS</h4>
                    <div className="submit-btn">
                        <button>
                        + New request
                        </button>
                    </div>
                </div>
                <hr style={{margin: "10px 10px", borderColor: "#aaa"}}/>
                <div className="searchbar">
                    <input type="search" placeholder="Search here"/>
                        <div className="choose">
                            <div>Display</div>
                            <div className="select">
                                <select>
                                    <option selected>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                    <option>100</option>
                                </select>
                            </div>
                            <div>Row</div>
                        </div>
                    <div>Filter</div>
                </div>
                <div>
                    <table>
                        <thead style={{ position: "sticky", top: 60}}>
                            <tr>
                                <td>COMPANY NAME</td>
                                <td>Address to</td>
                                <td>State</td>
                                <td>Status</td>
                                <td>Date</td>
                                <td>Action</td>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                        </tr>
                        </tbody>
                    </table>
                </div>
                {statusVisible && <LetterStatus/>}
            </div>
            </main>           
        </div>
        </>
    )
}

export default IntroLetter;