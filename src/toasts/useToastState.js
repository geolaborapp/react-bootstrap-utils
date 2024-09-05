import { useState, useCallback, useEffect, useRef } from 'react';
import { isFunction, isNumber } from 'js-var-type';

import { useArrayValueMap } from '../utils/useValueMap';
import { usePreviousValue } from '../utils/usePreviousValue';

import { TOASTS_VALID_TYPES, TOASTS_VALID_POSITIONS } from './toasts-helpers';

export function useToastState({ unique, messageFormatter, allCustomToasts }) {
  const [nextId, setNextId] = useState(0);
  const prevCustomToasts = usePreviousValue(allCustomToasts);
  const timeoutRefs = useRef({});

  const { push, unset, get, reset } = useArrayValueMap(
    unique && {
      equalityComparator: (a) => (b) => a.message === b.message,
    }
  );

  const prepareNextId = useCallback(() => setNextId((prevId) => prevId + 1), []);

  const show = useCallback(
    (message, { type = 'info', autoClose = 5000, position = 'TOP_RIGHT' } = {}) => {
      if (!TOASTS_VALID_TYPES.includes(type)) {
        throw new Error(`Invalid toast type ${type}. Must be ${TOASTS_VALID_TYPES}`);
      }

      if (!TOASTS_VALID_POSITIONS.includes(position)) {
        throw new Error(`Invalid toast position ${position}. Must be ${TOASTS_VALID_POSITIONS}`);
      }

      const toastId = nextId;
      const _message = isFunction(messageFormatter) ? messageFormatter(message) : message;

      push(position, {
        id: toastId,
        message: _message,
        type,
        position,
        closeControl: !autoClose,
      });

      if (isNumber(autoClose) && !isNaN(autoClose)) {
        const timeoutId = setTimeout(() => {
          close(position, toastId);
        }, autoClose);

        timeoutRefs.current[toastId] = { timeoutId, position };
      }

      prepareNextId();

      return toastId;
    },
    [close, messageFormatter, nextId, push, prepareNextId]
  );

  const close = useCallback(
    (position, toastId) => {
      const { timeoutId } = timeoutRefs.current?.[toastId] ?? {};

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      delete timeoutRefs.current[toastId];

      unset(position, (toast) => toast?.id !== toastId);
    },
    [unset]
  );

  const closeAll = useCallback(() => {
    for (const [toastId, { position }] of Object.entries(timeoutRefs.current)) {
      close(position, toastId);
    }

    reset();
  }, [close, reset]);

  const handleCustomState = useCallback(() => {
    const customIds = allCustomToasts?.map?.(({ _id } = {}) => _id);
    const prevCustomIds = prevCustomToasts?.map?.(({ _id } = {}) => _id);

    const newToasts = allCustomToasts?.filter?.((toast) => !prevCustomIds?.includes?.(toast?._id));
    const removedToasts = prevCustomToasts?.filter?.((toast) => !customIds?.includes?.(toast?._id));

    for (const toast of newToasts ?? []) {
      push(toast.position, { ...toast, id: nextId });
      prepareNextId();
    }
    for (const removedToast of removedToasts ?? []) {
      unset(removedToast.position, (toast) => toast?._id !== removedToast?._id);
    }
  }, [allCustomToasts, nextId, prepareNextId, prevCustomToasts, push, unset]);

  useEffect(handleCustomState, [handleCustomState]);

  useEffect(
    () => closeAll,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    show,
    close,
    closeAll,
    get,
  };
}
