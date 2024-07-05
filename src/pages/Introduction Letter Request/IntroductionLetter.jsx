import TopNav from "../../../components/Header/Header";
import SideBar from "../../../components/Sidebar/Sidebar";
import "./placement.scss"
import Empty from "/images/empty_dashboard.png"

const IntroductionLetter = () => {
    return ( <div className="introductionLetter">
        <SideBar dashboardClass={"dashy"} placementClass={"active-accordion placement filterPlacement"} init={0} activer={"activen"}/>
        <main>
            <TopNav disableReg={"registration disable"}/>
<div className="container">
<div className="topHead">
<div className="heading">
        INTRODUCTION LETTERS
    </div>
    <button className="newReq">
        + New Request
    </button></div>    
    <img src={Empty} alt="" />
</div>

        </main>
    </div> );
}
 
export default IntroductionLetter;