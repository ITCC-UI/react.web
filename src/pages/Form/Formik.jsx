import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';

const MyForm = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    };
    fetchData();
  }, []);

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('/api/users', values);
      
      setUsers([...users, values]); // Update local state (optional)
      setSubmitting(false);
      resetForm();
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.name}>{user.name} - {user.email}</li>
        ))}
      </ul>

      <h2>Add User</h2>
      <Formik initialValues={{ name: '', email: '' }} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <Field type="text" name="name" placeholder="Name" />
            <Field type="email" name="email" placeholder="Email" />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MyForm;
