import React, { useCallback, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { ToastsContainer } from '../dist/main';
import { ToastsExamples } from './ToastsExamples';

export function ToastWithCustomState() {
  const [customToasts, setCustomToasts] = useState([]);
  const [toastId, setToastId] = useState(0);

  const onClose = useCallback((toast) => setCustomToasts((last) => last.filter(({ _id }) => _id !== toast?._id)), []);
  const addToast = useCallback(
    (message, shouldAutoRemove = true) => {
      const newToast = {
        _id: toastId,
        message,
        type: 'info',
        position: 'TOP_RIGHT',
      };

      if (!shouldAutoRemove) {
        newToast.autoClose = false;
      }

      setCustomToasts((last) => [...last, newToast]);

      if (shouldAutoRemove) {
        setTimeout(() => {
          setCustomToasts((last) => last.filter(({ _id }) => _id !== toastId));
        }, [5000]);
      }

      setToastId((last) => last + 1);
    },
    [toastId]
  );

  return (
    <div className="row">
      Toasts with custom state
      <div className="d-flex justify-content-center">
        <div className="d-flex gap-2 ">
          <button className="btn btn-info mb-2 text-white" onClick={() => addToast('toast with custom state')}>
            Show Toast
          </button>
          <button
            className="btn btn-info mb-2 text-white"
            onClick={() => addToast(`Unique toast ${new Date().getTime()}`)}
          >
            Show Unique Toast
          </button>
          <button
            className="btn btn-info mb-2 text-white"
            onClick={() => addToast(`Unique toast without autoclose ${new Date().getTime()}`, false)}
          >
            Show Unique Toast without autoclose
          </button>
        </div>
      </div>
      <ToastsContainer customToasts={customToasts} onClose={onClose}>
        <ToastsExamples />
      </ToastsContainer>
    </div>
  );
}
