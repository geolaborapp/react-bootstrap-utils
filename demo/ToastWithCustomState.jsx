import React, { useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { ToastsContainer } from '../dist/main';
import { ToastsExamples } from './ToastsExamples';

export function ToastWithCustomState() {
  const [customToasts, setCustomToasts] = useState([]);
  const [toastId, setToastId] = useState(0);

  return (
    <div className="row">
      Toasts with custom state
      <div className="d-flex justify-content-center">
        <div className="d-flex gap-2 ">
          <button
            className="btn btn-info mb-2 text-white"
            onClick={() => {
              setCustomToasts((last) => [
                ...last,
                {
                  _id: toastId,
                  message: 'toast with custom state',
                  type: 'info',
                  position: 'TOP_RIGHT',
                },
              ]);

              setTimeout(() => {
                setCustomToasts((last) => last.filter(({ _id }) => _id !== toastId));
              }, [5000]);
              setToastId((last) => last + 1);
            }}
          >
            Show Toast
          </button>
          <button
            className="btn btn-info mb-2 text-white"
            onClick={() => {
              setCustomToasts((last) => [
                ...last,
                {
                  _id: toastId,
                  message: `Unique toast ${new Date().getTime()}`,
                  type: 'info',
                  position: 'TOP_RIGHT',
                },
              ]);

              setTimeout(() => {
                setCustomToasts((last) => last.filter(({ _id }) => _id !== toastId));
              }, [5000]);
              setToastId((last) => last + 1);
            }}
          >
            Show Unique Toast
          </button>
        </div>
      </div>
      <ToastsContainer customToasts={customToasts}>
        <ToastsExamples />
      </ToastsContainer>
    </div>
  );
}
