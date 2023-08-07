import React from 'react';

export const ToastsContext = React.createContext(null);

export const TOASTS_VALID_POSITIONS = ['TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT'];

export const TOASTS_VALID_TYPES = ['info', 'success', 'danger', 'warning'];

export const TOASTS_DEFAULT_STYLE = {
  position: 'fixed',
  maxWidth: '50%',
};

export const TOASTS_DEFAULT_STYLES_BY_POSITION = {
  TOP_RIGHT: {
    top: '25px',
    right: '25px',
  },
  TOP_LEFT: {
    top: '25px',
    left: '25px',
  },
  BOTTOM_RIGHT: {
    right: '25px',
    bottom: '25px',
  },
  BOTTOM_LEFT: {
    left: '25px',
    bottom: '25px',
  },
};
