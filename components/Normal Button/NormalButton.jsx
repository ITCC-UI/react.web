const NormalButton = ({registerSelf,onButtonClick}) => {
    return ( 
    <button className={registerSelf} onClick={onButtonClick}>Register</button> );
}
 
export default NormalButton;