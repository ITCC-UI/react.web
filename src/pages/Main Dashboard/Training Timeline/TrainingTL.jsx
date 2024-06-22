import "./dashcomponents.scss"
const DasboardComponents = ({header, content}) => {
    return ( 
        <div className="dashComponents">
            <div className="container dashCont">
                <div className="head">{header}</div>
           <div className="contents">
            {content}
           </div>
           
            </div>
        </div>
     );
}
 
export default DasboardComponents;