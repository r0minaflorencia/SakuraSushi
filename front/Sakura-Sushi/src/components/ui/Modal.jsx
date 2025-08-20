import React, { useEffect } from 'react';
import { Modal as BootstrapModal } from 'bootstrap';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRef = React.useRef(null);
  const modalInstance = React.useRef(null);

  const getModalSize = (size) => {
    switch (size) {
      case 'sm':
        return 'modal-sm';
      case 'lg':
        return 'modal-lg';
      case 'xl':
        return 'modal-xl';
      case 'md':
      default:
        return '';
    }
  };

  useEffect(() => {
    if (modalRef.current) {
      modalInstance.current = new BootstrapModal(modalRef.current, {
        backdrop: 'static' // Opcional: previene que se cierre al hacer clic fuera
      });

      const modalElement = modalRef.current;
      modalElement.addEventListener('hide.bs.modal', onClose);

      return () => {
        modalElement.removeEventListener('hide.bs.modal', onClose);
      };
    }
  }, [onClose]);

  useEffect(() => {
    if (modalInstance.current) {
      if (isOpen) {
        modalInstance.current.show();
      } else {
        modalInstance.current.hide();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalSizeClass = getModalSize(size);

  return (
    <div className="modal fade" ref={modalRef} tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
      <div className={`modal-dialog modal-dialog-centered ${modalSizeClass}`}>
        <div className="modal-content">
          {title && (
            <div className="modal-header">
              <h5 className="modal-title" id="modalLabel">{title}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
            </div>
          )}
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;