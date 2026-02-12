import React from 'react';
import PropTypes from 'prop-types';

import { formatClasses } from '../utils/attributes';

export function FormHelp({ id, inline = false, message }) {
  return (
    <small id={`${id}-help`} className={formatClasses(['text-muted', inline ? 'ms-2' : 'form-text'])}>
      {message}
    </small>
  );
}

FormHelp.propTypes = {
  id: PropTypes.string,
  message: PropTypes.node.isRequired,
  inline: PropTypes.bool,
};
