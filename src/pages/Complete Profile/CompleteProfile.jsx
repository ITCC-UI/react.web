import {React,useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import "./thisForm.scss";
import FormHeader from '../../../components/Header/FormHeader';
import axiosInstance from '../../../API Instances/AxiosIntances';
import { Helmet } from 'react-helmet';
import { DotLoader, PulseLoader } from 'react-spinners';

const FILE_SIZE = 800 * 1024; // 800kb in bytes

const PersonalDetailsSchema = Yup.object().shape({
  first_name: Yup.string().required('First Name is required'),
  middle_name: Yup.string(),
  phone_number: Yup.string()
  .matches(/^0[0-9]{10}$/, `Phone number is not in a correct format. \n It must start with '0' and be exactly 11 digits.`)
  .required('Phone Number is required'),
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

  

      if (!token) {
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

    
      if (response.status === 200 || response.status === 201) {
        
        setApiError(null);
        navigate('/complete-profile2');
      } else {

        setApiError(response.data);
      }
    } catch (error) {
      if (error.response) {
        setApiError(error.response.data);
      } else if (error.request) {
        
        setApiError({ message: 'No response received from the server' });
      } else {
        
        setApiError({ message: 'An error occurred while submitting your details' });
      }
      
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

            
                <h2>Personal Details</h2>
                <div className="formTop">
                  <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <Field type="text" name="first_name" placeholder="First Name" />
                    <ErrorMessage name="first_name" component="div" className="profile_error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="last_name">Surname</label>
                    <Field type="text" name="last_name" placeholder="Surname" />
                    <ErrorMessage name="last_name" component="div" className="profile_error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="middle_name">Middle Name</label>
                    <Field type="text" name="middle_name" placeholder="Middle Name" />
                    <ErrorMessage name="middle_name" component="div" className="profile_error" />
                  </div>
                </div>

                <div className="formTop">
                <div className="form-group">
  <label htmlFor="phone_number">Phone Number</label>
  <Field
    type="tel"
    name="phone_number"
    placeholder="Mobile Number"
    onKeyPress={(e) => {
      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }
    }}
  />
  <ErrorMessage name="phone_number">
  {(msg) => (
    <div className="profile_error">
      {msg.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < msg.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  )}
</ErrorMessage>
</div>
                  <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <Field type="date" name="dob" />
                    <ErrorMessage name="dob" component="div" className="profile_error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <Field as="select" name="gender">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Field>
                    <ErrorMessage name="gender" component="div" className="profile_error" />
                  </div>
                </div>

                <div className="formTop">
                  <div className="form-group">
                    <label htmlFor="nationality">Nationality</label>
                    <Field type="text" name="nationality" placeholder="Nationality" />
                    <ErrorMessage name="nationality" component="div" className="profile_error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Home Address</label>
                    <Field type="text" name="address" placeholder="Home Address" />
                    <ErrorMessage name="address" component="div" className="profile_error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="language">Language(s) other than English</label>
                    <Field type="text" name="language" placeholder="Language" />
                    <ErrorMessage name="language" component="div" className="profile_error" />
                  </div>
                </div>

                <div className="formTop">
                  <div className="form-group">
                    <label htmlFor="passport">Passport</label>
                    <input type="file" name="passport" onChange={(event) => setFieldValue('passport', event.currentTarget.files[0])} accept="image/*"/>
                    <ErrorMessage name="passport" component="div" className="profile_error" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="signature">Signature</label>
                    <input type="file" name="signature" onChange={(event) => setFieldValue('signature', event.currentTarget.files[0])} accept="image/*" />
                    <ErrorMessage name="signature" component="div" className="profile_error" />
                  </div>
                </div>

                <div className="button-container">
                  <button type="submit" disabled={isSubmitting} className="register_here">{isSubmitting? <PulseLoader size={10} color='white'/> : "Next"}</button>
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
