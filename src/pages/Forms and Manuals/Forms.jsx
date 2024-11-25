import Eye from "/images/eye.svg"
import Download from "/images/Download-white.png"

const ManForms = ({title, contents, buttons, reveal, download}) => {
    return ( <div className="forms">

<div className="div-holder">
    <div className="form-title">
        <div className="header-title">
        {title}
        </div>
        <img src={Eye} alt="Eye-Icon"  onClick={reveal} />
    </div>
    <div className="contents">
        {contents}
    </div>

    <button onClick={buttons} className="form-buttons"> <img src={Download} alt="download" /> Download</button>
</div>
    </div> );
}
 
export default ManForms;