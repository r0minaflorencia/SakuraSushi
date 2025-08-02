import React, { useState } from 'react';
import contactService from '../../services/contactService';

const ContactSection = ({ MapPin, Phone, Clock }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await contactService.sendMessage(formData);

            if (result.success) {
                alert('¡Mensaje enviado correctamente!');
                setFormData({ name: '', email: '', message: '' });
            } else {
                alert('Error al enviar el mensaje. Inténtalo de nuevo.');
            }
        } catch (error) {
            alert('Error al enviar el mensaje. Inténtalo de nuevo.');
            console.error('Contact form error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container my-5">
            <h2 className="display-5 fw-bold text-dark mb-4 text-center">Contactanos</h2>

            <div className="row g-4">
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

                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h3 className="h5 mb-4">Envíanos un Mensaje</h3>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Mensaje</label>
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        name="message"
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn btn-danger w-100"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Enviando...
                                        </>
                                    ) : (
                                        'Enviar Mensaje'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSection;