import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import WhatsAppButton from '/src/utils/formUtils.jsx';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-auto">
      {/* Contenido principal del pie de página */}
      <div className="container py-4">
        <div className="row g-4">

          {/* Contacto */}
          <div className="col-12 col-md-6 col-lg-3 mx-auto">
            <h6 className="fw-bold mb-3 text-uppercase text-center">Contacto</h6>
            <div className="d-flex flex-column gap-2 align-items-center">
              <div className="d-flex align-items-center">
                <MapPin size={16} className="me-2 text-muted" />
                <small className="text-light">Av. Corrientes 1234, CABA</small>
              </div>
              <div className="d-flex align-items-center">
                <Phone size={16} className="me-2 text-muted" />
                <small className="text-light">+54 11 1234-5678</small>
              </div>
              <div className="d-flex align-items-center">
                <Mail size={16} className="me-2 text-muted" />
                <small className="text-light">info@sakurasushi.com</small>
              </div>
            </div>
          </div>

          {/* Social & Horarios */}
          <div className="col-12 col-md-6 col-lg-3 mx-auto">
            <h6 className="fw-bold mb-3 text-uppercase text-center">Seguinos</h6>
            <div className="d-flex gap-3 mb-3 justify-content-center">
              <a href="#" className="text-light" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-light" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <WhatsAppButton />
            </div>
            <small className="text-muted d-block text-center">
              Mar-Vie: 19:00-00:00<br />
              Sáb-Dom: 12:00-00:00
            </small>
          </div>
          
        </div>
      </div>

      {/* Copyright */}
      <div className="border-top border-secondary">
        <div className="container py-3">
          <div className="row">
            <div className="col-12 text-center">
              <small className="text-light me-3">
                © {currentYear} Sakura Sushi. Todos los derechos reservados.
              </small>
              <a href="#" className="text-light text-decoration-none me-3">
                <small>Términos</small>
              </a>
              <a href="#" className="text-light text-decoration-none">
                <small>Privacidad</small>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;