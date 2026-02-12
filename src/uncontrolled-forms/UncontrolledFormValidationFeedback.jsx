import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { UncontrolledFormContext } from './helpers/useUncontrolledFormHelper';

export function UncontrolledFormValidationFeedback({ name, mockInvalidSibling = false }) {
  const formHelper = useContext(UncontrolledFormContext);

  const validationMessage = useMemo(() => formHelper.getValidationMessage(name), [formHelper, name]);
  const submitAttemped = useMemo(() => formHelper.getSubmitedAttempted(), [formHelper]);

  return (
    <>
      {mockInvalidSibling && submitAttemped && validationMessage && <div className="is-invalid"></div>}
      <div className={validationMessage ? 'invalid-feedback' : 'valid-feedback'}>
        {validationMessage || <span>&nbsp;</span>}
      </div>
    </>
  );
}

UncontrolledFormValidationFeedback.propTypes = {
  name: PropTypes.string.isRequired,
  mockInvalidSibling: PropTypes.bool,
};
