import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../CSS/DynamicForm.css';

const DynamicForm = () => {
  const [formFields, setFormFields] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const validateText = (value) => {
    return value.trim() === '' ? 'Text field cannot be empty' : '';
  };

  const validateDropdown = (items) => {
    return items.length === 0 ? 'Dropdown must have at least one item' : '';
  };

  const validateOptions = (options) => {
    return options.length < 2 ? 'There must be at least two options' : '';
  };

  const addField = (type) => {
    let newField;
    let validationError = '';
    switch (type) {
      case 'text':
        validationError = validateText('');
        // break;
      case 'dropdown':
        if (type === 'dropdown') {
        Swal.fire({
            title: 'Enter dropdown items (comma-separated)',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off',
              innerWidth:40
            },
            showCancelButton: true,
            confirmButtonText: 'Add',
            showLoaderOnConfirm: true,
            preConfirm: (dropdownItems) => {
              if (dropdownItems) {
                newField = {
                  label: `Dropdown ${formFields.length + 1}`,
                  type: type,
                  items: dropdownItems.split(',').map(item => item.trim()),
                };
                setFormFields([...formFields, newField]);
              }
            }
          }).then((result) => {
          if (result.value) {
            const dropdownItems = result.value;
            validationError = validateDropdown(dropdownItems);
            if (!validationError) {
              newField = {
                label: `Dropdown ${formFields.length + 1}`,
                type: type,
                items: dropdownItems.split(',').map(item => item.trim()),
              };
            }
          }
        });
    }
    else{
        newField = {
            label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${formFields.length + 1}`,
            type: type,
            items: type === 'dropdown' ? [] : null,
          };
          setFormFields([...formFields, newField]);
    }
        break;
      case 'checkbox':
      case 'radio':
        Swal.fire({
            title: `Enter ${type === 'checkbox' ? 'checkbox' : 'radio button'} options (comma-separated)`,
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Add',
            showLoaderOnConfirm: true,
            preConfirm: (options) => {
              if (options) {
                newField = {
                  label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${formFields.length + 1}`,
                  type: type,
                  options: options.split(',').map(option => {
                    const trimmedOption = option.trim();
                    return {
                      label: trimmedOption,
                      value: trimmedOption.toLowerCase().replace(/\s/g, '_')
                    };
                  }),
                };
                setFormFields([...formFields, newField]);
              }
            }
          }).then((result) => {
          if (result.value) {
            const options = result.value.split(',').map(option => option.trim());
            validationError = validateOptions(options);
            if (!validationError) {
              newField = {
                label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${formFields.length + 1}`,
                type: type,
                options: options.map(option => ({
                  label: option,
                  value: option.toLowerCase().replace(/\s/g, '_')
                })),
              };
            }
          }
        });
        break;
      default:
        break;
    }

    if (validationError) {
      setFormErrors({ [type]: validationError });
    } else if (newField) {
      setFormFields([...formFields, newField]);
      setFormErrors({ ...formErrors, [type]: '' });
    }
  };

  // ... (rest of your existing code)
  const removeField = (index) => {
    const updatedFields = [...formFields];
    updatedFields.splice(index, 1);
    setFormFields(updatedFields);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission
    console.log('Form Submitted:', formFields);
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        {formFields.map((field, index) => (
          <div key={index} className="form-field">
            <label>{field.label}:</label>
            {field.type === 'text' && <input type="text" />}
            {field.type === 'dropdown' && (
              <select>
                {field.items.map((item, idx) => (
                  <option key={idx} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}
            {(field.type === 'checkbox' || field.type === 'radio') && (
              <div>
                {field.options.map((option, idx) => (
                  <label key={idx}>
                    <input type={field.type} value={option.value} />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
            <button type="button" onClick={() => removeField(index)}>
              Remove
            </button>
          </div>
        ))}
        <div className="form-buttons">
          <button type="button" onClick={() => addField('text')}>
            Add Text Field
          </button>
          <button type="button" onClick={() => addField('dropdown')}>
            Add Dropdown
          </button>
          <button type="button" onClick={() => addField('checkbox')}>
            Add Checkbox
          </button>
          <button type="button" onClick={() => addField('radio')}>
            Add Radio Button
          </button>
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  )
};

export default DynamicForm;
