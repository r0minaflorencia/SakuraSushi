
import React from 'react';

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  pill = false,
  className = '',
  ...props
}) => {

  // Variantes de color
  const variantClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-white',
    danger: 'bg-danger text-white',
    warning: 'bg-warning text-dark',
    info: 'bg-info text-white',
    light: 'bg-light text-dark',
    dark: 'bg-dark text-white',
    // Variantes outline
    'outline-primary': 'border border-primary text-primary bg-transparent',
    'outline-secondary': 'border border-secondary text-secondary bg-transparent',
    'outline-success': 'border border-success text-success bg-transparent',
    'outline-danger': 'border border-danger text-danger bg-transparent',
    'outline-warning': 'border border-warning text-warning bg-transparent',
    'outline-info': 'border border-info text-info bg-transparent',
    'outline-dark': 'border border-dark text-dark bg-transparent'
  };

  // Tamaños
  const sizeClasses = {
    sm: 'px-2 py-1',
    md: 'px-2 py-1',
    lg: 'px-3 py-2'
  };

  // Font sizes responsivos
  const fontSizeClasses = {
    sm: 'fs-6',
    md: 'fs-6',
    lg: 'fs-5'
  };

  // Construir clases
  const baseClasses = 'badge fw-medium d-inline-flex align-items-center justify-content-center';
  const pillClass = pill ? 'rounded-pill' : 'rounded';
  const variantClass = variantClasses[variant] || variantClasses.primary;
  const sizeClass = sizeClasses[size];
  const fontSizeClass = fontSizeClasses[size];

  const allClasses = `${baseClasses} ${pillClass} ${variantClass} ${sizeClass} ${fontSizeClass} ${className}`.trim();

  return (
    <span className={allClasses} {...props}>
      {children}
    </span>
  );
};

// Componente Badge con contador (para números)
const CounterBadge = ({
  count,
  max = 99,
  variant = 'danger',
  size = 'sm',
  showZero = false,
  className = '',
  ...props
}) => {
  // No mostrar si count es 0 y showZero es false
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count;

  return (
    <Badge
      variant={variant}
      size={size}
      pill={true}
      className={`position-absolute ${className}`}
      style={{
        top: '-0.25rem',
        right: '-0.25rem',
        minWidth: '1.25rem',
        height: '1.25rem',
        fontSize: '0.75rem',
        ...props.style
      }}
      {...props}
    >
      {displayCount}
    </Badge>
  );
};

// Componente Badge con icono
const IconBadge = ({
  icon: Icon,
  children,
  iconSize = 14,
  variant = 'primary',
  size = 'md',
  pill = false,
  className = '',
  ...props
}) => {
  return (
    <Badge
      variant={variant}
      size={size}
      pill={pill}
      className={`gap-1 ${className}`}
      {...props}
    >
      {Icon && <Icon size={iconSize} />}
      {children}
    </Badge>
  );
};

// Componente Badge con estado
const StatusBadge = ({
  status = 'active',
  size = 'sm',
  showDot = true,
  className = '',
  ...props
}) => {
  const statusConfig = {
    active: { variant: 'success', text: 'Activo' },
    inactive: { variant: 'secondary', text: 'Inactivo' },
    pending: { variant: 'warning', text: 'Pendiente' },
    error: { variant: 'danger', text: 'Error' },
    processing: { variant: 'info', text: 'Procesando' }
  };

  const config = statusConfig[status] || statusConfig.active;

  return (
    <Badge
      variant={config.variant}
      size={size}
      pill={true}
      className={`gap-1 ${className}`}
      {...props}
    >
      {showDot && (
        <span
          className="rounded-circle"
          style={{
            width: '6px',
            height: '6px',
            backgroundColor: 'currentColor',
            opacity: 0.8
          }}
        />
      )}
      {config.text}
    </Badge>
  );
};

// Ejemplos de uso
const BadgeExamples = () => {
  return (
    <div className="container py-4">
      <div className="row g-4">

        {/* Badges básicos */}
        <div className="col-12">
          <h5 className="mb-3">Badges Básicos</h5>
          <div className="d-flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="light">Light</Badge>
            <Badge variant="dark">Dark</Badge>
          </div>
        </div>

        {/* Badges outline */}
        <div className="col-12">
          <h5 className="mb-3">Badges Outline</h5>
          <div className="d-flex flex-wrap gap-2">
            <Badge variant="outline-primary">Primary</Badge>
            <Badge variant="outline-success">Success</Badge>
            <Badge variant="outline-danger">Danger</Badge>
            <Badge variant="outline-warning">Warning</Badge>
          </div>
        </div>

        {/* Tamaños */}
        <div className="col-12">
          <h5 className="mb-3">Tamaños</h5>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </div>
        </div>

        {/* Pills */}
        <div className="col-12">
          <h5 className="mb-3">Pills</h5>
          <div className="d-flex flex-wrap gap-2">
            <Badge pill>Pill Badge</Badge>
            <Badge variant="success" pill>Success Pill</Badge>
            <Badge variant="warning" pill>Warning Pill</Badge>
          </div>
        </div>

        {/* Badge con contador */}
        <div className="col-12">
          <h5 className="mb-3">Counter Badges</h5>
          <div className="d-flex flex-wrap gap-4">
            <div className="position-relative">
              <button className="btn btn-primary">
                Mensajes
                <CounterBadge count={5} />
              </button>
            </div>
            <div className="position-relative">
              <button className="btn btn-outline-secondary">
                Notificaciones
                <CounterBadge count={150} max={99} />
              </button>
            </div>
          </div>
        </div>

        {/* Badge con estado */}
        <div className="col-12">
          <h5 className="mb-3">Status Badges</h5>
          <div className="d-flex flex-wrap gap-2">
            <StatusBadge status="active" />
            <StatusBadge status="inactive" />
            <StatusBadge status="pending" />
            <StatusBadge status="error" />
            <StatusBadge status="processing" />
          </div>
        </div>

      </div>
    </div>
  );
};

// Exportar componentes
export default Badge;
export { CounterBadge, IconBadge, StatusBadge, BadgeExamples };