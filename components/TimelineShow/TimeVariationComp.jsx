import TimeVariant from "./TimeVariant";
// import "./TimeVariant.scss";
import Arrow1 from "/images/Arrow_head1.png";
import Check1  from "/images/sch1.svg";
import Check2 from "/images/sch2.svg";
import SubSchedule from "./SubSchedule";
import SubSc from "/images/subschtick.svg"
import SubArrow1 from "/images/subArrow1.svg"
import SubArrow2 from "/images/subArrow2.svg"
import SubArrow4 from "/images/subArrow4.svg"
import SubArrow3 from "/images/subArrow3.svg"
const TVariant = () => {
    return ( <div className="tVant">
        <TimeVariant imageTimeline={Check1} todo='Registration' arrowImage= {<img src={Arrow1}/>} />
        <TimeVariant todoID="doings" thisClass="preTrain" imageTimeline={Check2} todo='Pre-Training' />
       <div className="subDoings">
       <SubSchedule  tick={SubSc} subHead= "Request for Introduction Letter" arrow={SubArrow1}/>
       <SubSchedule  tick={SubSc} subHead= "Request for Placement" arrow={SubArrow2}/>
       <SubSchedule  tick={SubSc} subHead= "Request for Change of placement" arrow={SubArrow3}/>
       <SubSchedule  tick={SubSc} subHead= "Submission of Acceptance Letter" arrow={SubArrow4}/>
       </div>
    </div> );
}
 
export default TVariant;