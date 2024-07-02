import React, {} from "react"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'sweetalert2/dist/sweetalert2.min.css';
import "./letterrequest.scss"

const MySwal = withReactContent(Swal);

const LetterRequest = ({setRequestVisible}) => {
    const showAlert = () => {
        MySwal.fire({
          title: 'Confirm Submission',
          text: "Confirm if all information provided is correct before submission",
          showCancelButton: true,
          confirmButtonColor: 'rgb(6, 6, 109)',
          cancelButtonColor: '',
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          reverseButtons: true,
          customClass: {
            actions: 'my-actions',
            confirmButton: 'confirm-button',
            cancelButton: 'cancel-button'
          },
        }).then((result) => {
          if (result.isConfirmed) {
            MySwal.fire('Submitted Successfuly!', 'Your information has been successfully submitted and is now under review', 'success');
          }
        });
      };
    const placeholders={
        name: "Enter the name of the company, e.g Firstbank",
        title: "Title/Position to address letter to, e.g The Managing Director",
        no: "Building No: No 24",
        street: "Street, e.g UI Road",
        area: "Area,e.g Ojoo",
        city: "City, e.g Ibadan",
        state: "State, e.g Oyo"
    }
    return (
        <>
            <div className="wrapper">
                <div><p onClick={() => setRequestVisible((prev) => { !prev })}>&#215;</p></div>
                <h4>Request for Introduction Letter</h4>
                <form action="/action_page.php">
                    <label htmlFor="cname">Company Name <sup>&#x2605;</sup></label><br/>
                    <input type="text" id="cname" name="cname" placeholder={placeholders.name}/><br/>
                    <label htmlFor="addressto">Address To <sup>&#x2605;</sup></label><br/>
                    <input type="text" id="addressto" name="addressto" placeholder={placeholders.title}/><br/>
                    <div style={{height: 24}}></div>
                    <hr/>
                    <div style={{height: 24}}></div>
                    <label htmlFor="cno">Company Address</label><br/>
                    <input style={{width: "24%"}} type="text" id="cno" name="cname" placeholder={placeholders.no}/><br/>
                    <input type="text" placeholder={placeholders.street}/><br/>
                    <input type="text" placeholder={placeholders.area}/><br/>
                    <div>
                        <input type="text" placeholder={placeholders.city}/><br/>
                        <input type="text" placeholder={placeholders.state}/><br/>
                    </div>
                    <input className="btn" type="button" value="Submit Request" onClick={showAlert}/>
                </form>
            </div>
        </>
    )
}

export default LetterRequest;