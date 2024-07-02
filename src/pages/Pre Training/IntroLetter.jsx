import React, { useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";

import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
import LetterSidebar from "./LetterSidebar";
import LetterRequest from "./LetterRequest";
import CustomAlert from "./CustomAlert";
import "./introductionletter.scss";

const IntroLetter = () => {
    const [sidebarData, setSidebarData] = useState({})
    const [sidebarVisible, setSidebarVisible] = useState(false)
    const [requestVisible, setRequestVisible] = useState(true)

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
            <CustomAlert/>
            <div className="placement route-Dash">
                <SideBar dashboardClass={"active dashy"} placementClass={"placement"} />
                <main>
                    <TopNav disableReg={"registration disable"} />
                    <div className="introComponent entireContainer">
                        <div className="header">
                            <h4 className="title">INTRODUCTION  LETTERS</h4>
                            <div className="submit-btn">
                                <button onClick={() => setRequestVisible(true)}>
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
                                <thead style={{}}>
                                {/* <thead style={{ position: "sticky", top: 60 }}> */}
                                    <tr>
                                        <td>COMPANY NAME</td>
                                        <td>Address to</td>
                                        <td>State</td>
                                        <td><p>Status</p></td>
                                        <td>Date</td>
                                        <td>Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        [...data, ...data, ...data].map((i) =>
                                            <tr key={i._id || i.id}>
                                                <td>{i.name}</td>
                                                <td>{i.address}</td>
                                                <td>{i.state}</td>
                                                <td><p className = {i.status}>{i.status}</p></td>
                                                <td>{new Date().toLocaleString('en-US', options) + "."}</td>
                                                <td className="td-last">
                                                    <div className="view-more-btn" onClick={() => { setSidebarData(i); setSidebarVisible(true); }}>
                                                        View more
                                                    </div>
                                                    <MdOutlineFileDownload color="blue" size={24} className="download-icon"/>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                        {sidebarVisible && <LetterSidebar sidebarData={sidebarData} setSidebarVisible={setSidebarVisible}/>}
                        {requestVisible && <LetterRequest setRequestVisible={setRequestVisible}/>}
                    </div>
                </main>
            </div>
        </>
    )
}

export default IntroLetter;