import React, { useState } from 'react';

const ContactForm = () => {
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
            // Aquí iría la lógica para enviar el formulario a una API.
            console.log('Enviando formulario:', formData);
            
            // Simulación de envío
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            alert('¡Mensaje enviado correctamente!');
            setFormData({ name: '', email: '', message: '' });

        } catch (error) {
            alert('Error al enviar el mensaje. Inténtalo de nuevo.');
            console.error('Error en el formulario de contacto:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
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
    );
};

export default ContactForm;