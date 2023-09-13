import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export function ModalPortal({ children, title, isOpen }) {
  const [container, setContainer] = useState();

  useEffect(() => {
    const modalPortalsElem = getModalPortalsElem();

    const containerElem = document.createElement('div');

    containerElem.dataset.title = title;

    modalPortalsElem.appendChild(containerElem);
    setContainer(containerElem);

    return () => {
      if (!container) {
        return;
      }

      const isDescendant = modalPortalsElem.contains(container);

      if (isDescendant) {
        modalPortalsElem.removeChild(container);
      }
    };
    //"container" causaria um loop infinito
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  //FIXME: prop to define if modal will be always included into DOM
  if (!container || !isOpen) {
    return '';
  }

  return ReactDOM.createPortal(children, container);
}

ModalPortal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

function getModalPortalsElem() {
  let modalPortalsElem = document.querySelector('#modal-portals');

  if (!modalPortalsElem) {
    const body = document.querySelector('body');

    modalPortalsElem = document.createElement('div');
    modalPortalsElem.id = 'modal-portals';
    body.appendChild(modalPortalsElem);
  }

  return modalPortalsElem;
}
