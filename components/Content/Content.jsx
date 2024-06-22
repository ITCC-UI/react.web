import "./content.scss";

const Content = () => {
    return (
        <div className="timeline">
            <div className="industrial days">
                <div className="daysDone">

                </div>
                <div className="daysRem">

                </div>
            
            </div>

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