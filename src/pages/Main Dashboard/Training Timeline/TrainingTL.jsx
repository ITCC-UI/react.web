import "./dashcomponents.scss"
const DasboardComponents = ({header, content,schedule}) => {
    return ( 
        <div className="dashComponents" id={schedule}>
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