import React from 'react';
import PropTypes from 'prop-types';

import { UncontrolledFormLabel } from './UncontrolledFormLabel';
import { UncontrolledFormHelp } from './UncontrolledFormHelp';
import { UncontrolledFormValidationFeedback } from './UncontrolledFormValidationFeedback';

export function UncontrolledFormGroup({ children, name, feedback = true, mockInvalidSibling = false, help, ...props }) {
  return (
    <div className="mb-3">
      <UncontrolledFormLabel {...props} />
      {children}
      {feedback && <UncontrolledFormValidationFeedback mockInvalidSibling={mockInvalidSibling} name={name} />}
      {help && <UncontrolledFormHelp message={help} />}
    </div>
  );
}

UncontrolledFormGroup.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  feedback: PropTypes.bool,
  help: PropTypes.node,
  label: PropTypes.node.isRequired,
  mockInvalidSibling: PropTypes.bool,
  name: PropTypes.string.isRequired,
};
