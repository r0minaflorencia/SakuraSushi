import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import ContactForm from './ContactForm';

const ContactSection = () => {
    return (
        <div className="container my-5">
            <h2 className="display-5 fw-bold text-dark mb-4 text-center">Contactanos</h2>
            <div className="row g-4">
                {/* Columna de Información de Contacto */}
                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h3 className="h5 mb-4">Información de Contacto</h3>
                            <div className="d-flex align-items-center mb-3">
                                <MapPin className="text-danger me-3" size={20} />
                                <div>
                                    <strong>Dirección:</strong><br />
                                    <span className="text-muted">Av. Corrientes 1234, CABA</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <Phone className="text-danger me-3" size={20} />
                                <div>
                                    <strong>Teléfono:</strong><br />
                                    <span className="text-muted">+54 11 1234-5678</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <Clock className="text-danger me-3" size={20} />
                                <div>
                                    <strong>Horarios:</strong><br />
                                    <span className="text-muted">Mar-Dom: 19:00 - 00:00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna del Formulario, que ahora es un componente separado */}
                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h3 className="h5 mb-4">Envíanos un Mensaje</h3>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSection;