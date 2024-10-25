import React, { useState } from 'react';
import { useField } from 'formik';

const StatesComboBox = ({ options, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const [inputValue, setInputValue] = useState(field.value);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    helpers.setValue(value);
    setShowDropdown(true);
  };

  const handleOptionSelect = (option) => {
    setInputValue(option);
    helpers.setValue(option);
    setShowDropdown(false);
  };

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <>
    <div className="formInput">
      <input
        {...field}
        {...props}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => {
          field.onBlur(props.name);
          setTimeout(() => setShowDropdown(false), 200);
        }}
        autoComplete='off'
        className="combo"
      />
      {showDropdown && (
        <ul className="absolute w-full mt-1 max-h-60 overflow-auto bg-white border rounded shadow-lg z-10 lists states">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionSelect(option)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {option}
              </div>
            ))
          ) : (
            <div className="register_above">Not found, you can continue</div>
          )}
        </ul>
      )}
    </div></>
  );
};

export default StatesComboBox;