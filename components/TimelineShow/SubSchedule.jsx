const SubSchedule = ({tick, subHead, arrow}) => {
    return ( 
        <div className="subschedule">
            <div className="subings">
                <div className="images">
                    <img src={tick} alt="Ticked" />
                </div>

               <div className="nestle">
               <div className="subheading">
                    {subHead}
                </div>

                <div className="arrow">
                    <img src={arrow} alt="" />
                </div>
               </div>
            </div>
        </div>
     );
}
 
export default SubSchedule;