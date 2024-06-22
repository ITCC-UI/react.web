import "./headingstyle.scss"

const ProfileHead = ({headings, duration}) => {
    return ( 
        <div className="headingx">
            {headings}  <i>{duration}</i>
        </div>
     );
}
 
export default ProfileHead;