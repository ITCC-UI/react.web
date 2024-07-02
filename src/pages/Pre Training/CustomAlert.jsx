import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'sweetalert2/dist/sweetalert2.min.css';
// import './App.css'; // Custom CSS for styling

const MySwal = withReactContent(Swal);

const CustomAlert = () => {
  const showAlert = () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        actions: 'my-actions',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  };

  return (
    <div>
      <button onClick={showAlert}>Show Alert</button>
    </div>
  );
};

export default CustomAlert;
