const contactService = {
  /**
   * Simula el envío de un formulario de contacto a un servidor.
   * @param {object} formData - Un objeto con los datos del formulario (name, email, message).
   * @returns {Promise<object>} Una promesa que se resuelve con un objeto de éxito o falla.
   */
  send: async (formData) => {
    console.log('Simulando envío de mensaje...', formData);

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Mensaje enviado (simulación).');
        resolve({
          success: true,
          message: 'Mensaje recibido, gracias por contactarnos.',
        });
      }, 1000); // Espera 1 segundo
    });
  },
};

export default contactService;
