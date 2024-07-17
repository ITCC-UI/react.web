import {React,useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import "./thisForm.scss";
import FormHeader from '../../../components/Header/FormHeader';
import axiosInstance from '../../../API Instances/AxiosIntances';
import { Helmet } from 'react-helmet';

const FILE_SIZE = 800 * 1024; // 800kb in bytes

const PersonalDetailsSchema = Yup.object().shape({
  first_name: Yup.string().required('First Name is required'),
  middle_name: Yup.string(),
  phone_number: Yup.string().required('Phone Number is required').min(11, "Phone number must be 11 digits").max(11, "Phone number must be 11 digits"),
  last_name: Yup.string().required('Last Name is required'),
  dob: Yup.date().required('Date of Birth is required').test(
    'is-16-years-old',
    'You must be 16 years old and above to commence this training',
    function (value) {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        return age > 16;
      }
      return age >= 16;
    }
  ),
  gender: Yup.string().required('Gender is required'),
  nationality: Yup.string().required('Nationality is required'),
  address: Yup.string().required("Address is required"),
  language: Yup.string().required('Language is required'),
  passport: Yup.mixed().required('Passport is required').test(
    'fileSize',
    'File size too large, should be less than 800kb',
    value => value && value.size <= FILE_SIZE
  ),
  signature: Yup.mixed().required('Signature is required').test(
    'fileSize',
    'File size too large, should be less than 800kb',
    value => value && value.size <= FILE_SIZE
  ),
});

const UpdateProfileForm = () => {
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const [apiError, setApiError] = useState(null);
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

      const response = await axiosInstance.post(
        'student/profile/',
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );

      console.log('Response:', response);
      if (response.status === 200 || response.status === 201) {
        console.log('Personal details submitted successfully');
        setApiError(null);
        navigate('/ims/complete-profile2');
      } else {
        console.error('Unexpected response status:', response.status);
        console.error('Unexpected response data:', response.data);
        setApiError(response.data);
      }
    } catch (error) {
      console.error('Error in handleSubmitPersonalDetails:');
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Status code:', error.response.status);
        console.error('Headers:', error.response.headers);
        setApiError(error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setApiError({ message: 'No response received from the server' });
      } else {
        console.error('Error setting up request:', error.message);
        setApiError({ message: 'An error occurred while submitting your details' });
      }
      console.error('Error config:', error.config);
    }
  };

  const thisError=typeof apiError === 'string' ? (
    apiError
  ) : (
    <pre>{JSON.stringify(apiError, null, 2)}
    
    </pre>
  )

  return (
    <div className="formWrapper">
      <Helmet>
        <title>
          ITCC - Update Profile 
        </title>
      </Helmet>
      <FormHeader />
      <div className="formCase">
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

              {/* <div className="siginError">
    {apiError && (
      <div className="error-message">
      
        {console.log(thisError.props)}
      </div>
    )}
  </div> */}
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
                    <label htmlFor="address">Home Address</label>
                    <Field type="text" name="address" placeholder="Home Address" />
                    <ErrorMessage name="address" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="language">Language(s) other than English</label>
                    <Field type="text" name="language" placeholder="Language" />
                    <ErrorMessage name="language" component="div" className="error" />
                  </div>
                </div>

                <div className="formTop">
                  <div className="form-group">
                    <label htmlFor="passport">Passport</label>
                    <input type="file" name="passport" onChange={(event) => setFieldValue('passport', event.currentTarget.files[0])} accept="image/*"/>
                    <ErrorMessage name="passport" component="div" className="error" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="signature">Signature</label>
                    <input type="file" name="signature" onChange={(event) => setFieldValue('signature', event.currentTarget.files[0])} accept="image/*" />
                    <ErrorMessage name="signature" component="div" className="error" />
                  </div>
                </div>

                <div className="button-container">
                  <button type="submit" disabled={isSubmitting} className="register_here">{isSubmitting? 'Submitting please wait...' : "Next"}</button>
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
