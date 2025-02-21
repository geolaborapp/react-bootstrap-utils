import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { isEmptyLike } from 'js-var-type';

import { FormContext } from './helpers/form-helpers';

export function FormValidationFeedback({ name, mockInvalidSibling }) {
  const formState = useContext(FormContext);
  let validationMessage = formState.getValidationMessage(name);

  if (validationMessage === 'undefined' || validationMessage === 'null' || isEmptyLike(validationMessage)) {
    validationMessage = '';
  }

  return (
    <>
      {mockInvalidSibling && formState.getSubmitedAttempted() && validationMessage && (
        <div className="is-invalid"></div>
      )}
      <div className={validationMessage ? 'invalid-feedback' : 'valid-feedback'}>
        {validationMessage || <span>&nbsp;</span>}
      </div>
    </>
  );
}

FormValidationFeedback.defaultProps = {
  mockInvalidSibling: false,
};

FormValidationFeedback.propTypes = {
  name: PropTypes.string.isRequired,
  mockInvalidSibling: PropTypes.bool,
};
