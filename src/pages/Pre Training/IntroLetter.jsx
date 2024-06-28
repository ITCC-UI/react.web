import React, { useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";

import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
import "./introductionletter.scss"

const IntroLetter = () => {
    const [statusVisible, setStatusVisible] = useState(false)
    const [visibleData, setVisibleData] = useState(null)

    const LetterStatus = () => {
        const a = "lorem"
        return (
            <div className="statusComponent">
                <div><h3 onClick={() => setStatusVisible((prev) => { !prev })}>&#215;</h3></div>
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
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    };

    const data = [
        {
            name: "PaceSetter Ltd.",
            address: "THE CEO",
            state: "OYO",
            status: "Rejected"
        },
        {
            name: "Fako-fak Company Ltd.",
            address: "THE CEO",
            state: "OYO",
            status: "Approved"
        },
        {
            name: "Frontier Developers",
            address: "THE CEO",
            state: "OYO",
            status: "Approved"
        },
        {
            name: "Fako-fak Company Ltd.",
            address: "THE CEO",
            state: "OYO",
            status: "Rejected"
        },
        {
            name: "Fako-fak Company Ltd.",
            address: "THE CEO",
            state: "OYO",
            status: "Approved"
        },
        {
            name: "Unilever Nigeria",
            address: "THE CEO",
            state: "OYO",
            status: "Approved"
        }
    ]
    return (
        <>
            <div className="placement route-Dash">
                <SideBar dashboardClass={"active dashy"} placementClass={"placement"} />
                <main>
                    <TopNav disableReg={"registration disable"} />

                    <div className="introComponent entireContainer">
                        <div className="header">
                            <h4 className="title">INTRODUCTION  LETTERS</h4>
                            <div className="submit-btn">
                                <button>
                                    + New request
                                </button>
                            </div>
                        </div>
                        <hr style={{ margin: "10px 10px", borderColor: "#aaa" }} />
                        <div className="searchbar">
                            <input type="search" placeholder="Search here" />
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
                                <thead style={{ position: "sticky", top: 60 }}>
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
                                    {
                                        [...data].map((i) =>
                                            <tr key={i._id || i.id}>
                                                <td>{i.name}</td>
                                                <td>{i.address}</td>
                                                <td>{i.state}</td>
                                                <td>{i.status}</td>
                                                <td>{new Date().toLocaleString('en-US', options) + "."}</td>
                                                <td>
                                                    <button className="view-more-btn" onClick={() => { setStatusVisible(true); console.log(i) }}>View more <MdOutlineFileDownload /></button>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                        {statusVisible && <LetterStatus />}
                    </div>
                </main>
            </div>
        </>
    )
}

export default IntroLetter;