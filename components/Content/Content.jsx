import "./content.scss";
import ChartBoard from "../ChartBar/ChartBoard";
const Content = () => {
    return (
        <div className="timeline">
            <ChartBoard/>

            <div className="daysCompleted">
                <div className="indicator complete">

                </div> Days Completed
            </div>

            <div className="daysIncompleted">
                <div className="indicator incomplete">

                </div> Days Remaining
            </div>
        </div>
     );
}
 
export default Content;