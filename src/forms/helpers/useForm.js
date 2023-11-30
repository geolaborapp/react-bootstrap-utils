import { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash-es';

import { isFunction } from 'js-var-type';

import { useArrayValueMap } from '../../utils/useValueMap';
import { setValueByPath, deepClone, getValueByPath } from '../../utils/getters-setters';

import { validateFormElement } from './form-helpers';

function useFormState(initialState, { onChange, transform }) {
  const [formState, setFormState] = useState(initialState);
  const [isDirty, setIsDirty] = useState(false);
  const onChangeRef = useRef(debounce(onChange, 1000));
  const transformRef = useRef(
    debounce(
      (nextFormState, name) =>
        transform(nextFormState, name, (state) => {
          setFormState(state);
        }),
      500
    )
  );

  useEffect(() => {
    if (isDirty) {
      onChangeRef.current(formState);
    }
  }, [formState, isDirty]);

  return {
    getState() {
      return formState;
    },
    updateState(name, value) {
      setIsDirty(true);
      setFormState((prevFormState) => {
        const nextFormState = nextState(prevFormState, name, value);

        setTimeout(() => {
          transformRef.current(nextFormState, name);
        });

        return nextFormState;
      });
    },
    resetState() {
      setIsDirty(false);
      setFormState(initialState);
    },
  };
}

export function useForm(initialState, { validations, onChange, transform }) {
  const { getState, updateState, resetState } = useFormState(initialState, { onChange, transform });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [, setRefreshForm] = useState(false);
  const { getAllKeys: getElementNames, get: getElementRefs, push: registerElementRef } = useArrayValueMap();

  const formState = getState();
  const validateForm = useCallback(
    (_formData) => {
      const elementNames = getElementNames();
      let isFormValid = true;
      const formData = _formData || formState;

      for (const name of elementNames) {
        const isElementValid = !validateFormElement({
          name,
          formData,
          validations: validations[name],
          elementRefs: getElementRefs(name),
        });

        if (!isElementValid) {
          isFormValid = false;
        }
      }

      return isFormValid;
    },
    [formState, getElementNames, getElementRefs, validations]
  );

  const getValidationMessage = useCallback(
    (name) => {
      const elementRefs = getElementRefs(name);

      return elementRefs && elementRefs[0] ? elementRefs[0].validationMessage : '';
    },
    [getElementRefs]
  );

  useEffect(() => {
    if (validations && isFunction(validateForm)) {
      validateForm();
      setRefreshForm((v) => !v);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validations]);

  return {
    register(name, elementRef) {
      registerElementRef(name, elementRef);

      if (validations) {
        validateFormElement({
          name,
          formData: formState,
          validations: validations[name],
          elementRefs: [elementRef],
        });
      }
    },
    update(name, value) {
      updateState(name, value);

      if (validations) {
        validateForm(nextState(formState, name, value));
      }
    },
    getFormData() {
      return formState;
    },
    getValue(name) {
      return getValueByPath(formState, name);
    },
    reset() {
      resetState();
      setSubmitAttempted(false);
    },
    setSubmitedAttempted() {
      setSubmitAttempted(true);
    },
    getSubmitedAttempted() {
      return submitAttempted;
    },
    getValidationMessage,
    validateForm,
  };
}

function nextState(previousState, path, value) {
  return setValueByPath(deepClone(previousState), path, value);
}
