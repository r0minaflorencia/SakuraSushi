import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; 

const WhatsAppButton = () => {
  const phoneNumber = '1234567890';
  const message = 'Hola!...';
  const encodedMessage = encodeURIComponent(message);

  return (
    <a
      href={`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-light"
      aria-label="WhatsApp"
    >
      <FaWhatsapp size={20} />
    </a>
  );
};

export default WhatsAppButton;