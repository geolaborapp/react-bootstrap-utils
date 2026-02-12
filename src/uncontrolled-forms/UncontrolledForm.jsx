import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { useUncontrolledFormHelper, UncontrolledFormContext } from './helpers/useUncontrolledFormHelper';
import { UncontrolledFormActions } from './UncontrolledFormActions';

export function UncontrolledForm({
  cancelLabel = 'Cancel',
  children,
  customActions,
  customValidation = false,
  debounceWait = 500,
  initialValues,
  onCancel = () => {},
  onChange = () => {},
  onSubmit = () => {},
  submitLabel = 'Submit',
  validations,
  transform,
}) {
  const formHelper = useUncontrolledFormHelper(initialValues, { debounceWait, transform, onChange, validations });
  const formRef = useRef(null);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const resetForm = useCallback(() => {
    if (formRef.current && formRef.current.classList) {
      formRef.current.classList.remove('was-validated');
    }

    formHelper.reset();
  }, [formHelper]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      formHelper.setSubmitedAttempted();

      if (customValidation && !formRef.current.checkValidity()) {
        formRef.current.classList.add('was-validated');

        return;
      }

      setIsSubmiting(true);

      const submitResponse = onSubmit(formHelper.getFormData(), resetForm);

      let submitPromise = Promise.resolve();

      if (submitResponse && submitResponse.then) {
        submitPromise = submitResponse.then(() => {
          resetForm();
        });
      }

      submitPromise.finally(() => {
        setIsSubmiting(false);
      });
    },
    [customValidation, formHelper, onSubmit, resetForm]
  );

  function handleCancel() {
    onCancel(resetForm);
  }

  const formProps = {
    ref: formRef,
    onSubmit: handleSubmit,
  };

  if (customValidation) {
    formProps.noValidate = true;
  }

  return (
    <form {...formProps}>
      <UncontrolledFormContext.Provider value={formHelper}>{children}</UncontrolledFormContext.Provider>
      <UncontrolledFormActions {...{ submitLabel, cancelLabel, onCancel: handleCancel, isSubmiting, customActions }} />
    </form>
  );
}

UncontrolledForm.propTypes = {
  cancelLabel: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  customActions: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  customValidation: PropTypes.bool,
  debounceWait: PropTypes.number,
  initialValues: PropTypes.object,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
  transform: PropTypes.func,
  validations: PropTypes.object,
};
