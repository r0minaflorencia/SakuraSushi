import React from 'react';

const Spinner = ({ size = 'md', color = 'primary' }) => {
  const getSpinnerSize = (size) => {
    switch (size) {
      case 'sm':
        return 'spinner-border-sm';
      case 'lg':
        // Bootstrap no tiene una clase 'lg' para spinner-border, se usa el tamaño por defecto
        return '';
      case 'md':
      default:
        // Tamaño por defecto de Bootstrap
        return '';
    }
  };

  const getSpinnerColor = (color) => {
    switch (color) {
      case 'blue':
        return 'text-primary';
      case 'red':
        return 'text-danger';
      case 'gray':
        return 'text-secondary';
      case 'white':
        return 'text-white';
      default:
        return 'text-primary';
    }
  };

  const spinnerSizeClass = getSpinnerSize(size);
  const spinnerColorClass = getSpinnerColor(color);

  return (
    <div className="d-flex justify-content-center">
      <div className={`spinner-border ${spinnerSizeClass} ${spinnerColorClass}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;