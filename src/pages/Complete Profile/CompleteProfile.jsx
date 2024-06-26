import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./thisForm.scss";
import FormHeader from '../../../components/Header/FormHeader';

const PersonalDetailsSchema = Yup.object().shape({
  first_name: Yup.string().required('First Name is required'),
  middle_name: Yup.string(),
  phone_number: Yup.string().required('Phone Number is required'),
  last_name: Yup.string().required('Last Name is required'),
  dob: Yup.date().required('Date of Birth is required'),
  gender: Yup.string().required('Gender is required'),
  nationality: Yup.string().required('Nationality is required'),
  address: Yup.string().required('Address is required'),
  next_of_kin: Yup.string(),
  next_of_kin_address: Yup.string(),
  next_of_kin_relationship: Yup.string(),
  next_of_kin_phone_number: Yup.string(),
  campus_address: Yup.string(),
  language: Yup.string().required('Language is required'),
  passport: Yup.mixed().required('Passport is required'),
  signature: Yup.mixed().required('Signature is required'),
});

const UpdateProfileForm = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmitPersonalDetails = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] instanceof File) {
          formData.append(key, values[key], values[key].name);
        } else if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      // Log the form data for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      if (!token) {
        console.error('No token found');
        return false;
      }

      const response = await axios.post(
        'https://theegsd.pythonanywhere.com/api/v1/student/profile/',
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      console.log('Response:', response);

      if (response.status === 200 || response.status === 201) {
        console.log('Personal details submitted successfully');
        navigate('/complete-profile2'); // Redirect to success page
      } else {
        console.error('Unexpected response status:', response.status);
        console.error('Unexpected response data:', response.data);
        <div className="error">There was an error saving your data</div>
      }
    } catch (error) {
      console.error('Error in handleSubmitPersonalDetails:');
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Status code:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      console.error('Error config:', error.config);
    }
  };

  return (
    <div className="formWrapper">
      <FormHeader/>
      <div className="formCase">
        {/* <h1>Update Profile Information</h1> */}
        <Formik
          initialValues={{
            first_name: '',
            last_name: '',
            middle_name: '',
            phone_number: '',
            dob: '',
            gender: '',
            nationality: '',
            address: '',
            next_of_kin: '',
            next_of_kin_address: '',
            next_of_kin_relationship: '',
            next_of_kin_phone_number: '',
            campus_address: '',
            language: '',
            passport: null,
            signature: null,
          }}
          validationSchema={PersonalDetailsSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await handleSubmitPersonalDetails(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form id="regForm">
              <div className="section">
                <h2>Personal Details</h2>
                <div className="formTop">
                  <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <Field type="text" name="first_name" placeholder="First Name" />
                    <ErrorMessage name="first_name" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <Field type="text" name="last_name" placeholder="Last Name" />
                    <ErrorMessage name="last_name" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="middle_name">Middle Name</label>
                    <Field type="text" name="middle_name" placeholder="Middle Name" />
                    <ErrorMessage name="middle_name" component="div" className="error" />
                  </div>
                </div>

                <div className="formTop">
                  <div className="form-group">
                    <label htmlFor="phone_number">Phone Number</label>
                    <Field type="text" name="phone_number" placeholder="Mobile Number" />
                    <ErrorMessage name="phone_number" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <Field type="date" name="dob" />
                    <ErrorMessage name="dob" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <Field as="select" name="gender">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Field>
                    <ErrorMessage name="gender" component="div" className="error" />
                  </div>
                </div>

                <div className="formTop">
                  <div className="form-group">
                    <label htmlFor="nationality">Nationality</label>
                    <Field type="text" name="nationality" placeholder="Nationality" />
                    <ErrorMessage name="nationality" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <Field type="text" name="address" placeholder="Home Address" />
                    <ErrorMessage name="address" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="next_of_kin">Next of Kin</label>
                    <Field type="text" name="next_of_kin" placeholder="Name of Next of Kin" />
                    <ErrorMessage name="next_of_kin" component="div" className="error" />
                  </div>
                </div>

                <div className="formTop">
                  <div className="form-group">
                    <label htmlFor="next_of_kin_address">Next of Kin Address</label>
                    <Field type="text" name="next_of_kin_address" placeholder="Address of Next of Kin" />
                    <ErrorMessage name="next_of_kin_address" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="next_of_kin_relationship">Next of Kin Relationship</label>
                    <Field type="text" name="next_of_kin_relationship" placeholder="Relationship with Next of Kin" />
                    <ErrorMessage name="next_of_kin_relationship" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="next_of_kin_phone_number">Next of Kin Phone Number</label>
                    <Field type="text" name="next_of_kin_phone_number" placeholder="Phone Number of Next of Kin" />
                    <ErrorMessage name="next_of_kin_phone_number" component="div" className="error" />
                  </div>
                </div>

                <div className="formTop">
                  <div className="form-group">
                    <label htmlFor="campus_address">Campus Address</label>
                    <Field type="text" name="campus_address" placeholder="Campus Address" />
                    <ErrorMessage name="campus_address" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="language">Language</label>
                    <Field type="text" name="language" placeholder="Language" />
                    <ErrorMessage name="language" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="passport">Passport</label>
                    <input type="file" name="passport" onChange={(event) => setFieldValue('passport', event.currentTarget.files[0])} />
                    <ErrorMessage name="passport" component="div" className="error" />
                  </div>
                </div>
                <div className="formTop">
                  <div className="form-group">
                    <label htmlFor="signature">Signature</label>
                    <input type="file" name="signature" onChange={(event) => setFieldValue('signature', event.currentTarget.files[0])} />
                    <ErrorMessage name="signature" component="div" className="error" />
                  </div>
                </div>

                <div className="button-container">
                <button type="submit" disabled={isSubmitting} className='register_here'>Next</button>
              </div>
              </div>

              
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateProfileForm;
