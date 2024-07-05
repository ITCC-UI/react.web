import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Field, ErrorMessage } from 'formik';

const BankDropdown = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get('https://theegsd.pythonanywhere.com/api/v1/lookups/banks/');
        setBanks(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching banks');
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="formInput">
      <label htmlFor="bank_name">Bank Name</label>
      <Field as="select" name="bank_name">
        <option value="">Select a bank</option>
        {banks.map((bank) => (
          <option key={bank.id} value={bank.name}>
            {bank.name}
          </option>
        ))}
      </Field>
      <ErrorMessage name="bank_name" component="div" className="error" />
    </div>
  );
};

export default BankDropdown;
