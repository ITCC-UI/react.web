import "./timeline.scss"

const TimeVariant = ({imageTimeline,todo,arrowImage, todoID, thisClass}) => {
    return ( <div className="timeVariant">
        <div className="imageTimeline" id={thisClass}>
            <img src={imageTimeline} alt="timeline"/>
        </div>
        <div className="todo" id={todoID}>
            {todo}
    </div>
    <div className="arrow">
    {arrowImage}
    </div>
    </div> );
}
 
export default TimeVariant;