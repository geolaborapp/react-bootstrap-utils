import React from 'react';
import PropTypes from 'prop-types';
import { isBoolean } from 'js-var-type';

export function UncontrolledFormLabel({ id, label, required: _required }) {
  const required = isBoolean(_required) && _required;

  return (
    <label className="form-label" htmlFor={id}>
      {label}

      {required && <span className="text-danger"> *</span>}
    </label>
  );
}

UncontrolledFormLabel.propTypes = {
  id: PropTypes.string,
  label: PropTypes.node.isRequired,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
};
