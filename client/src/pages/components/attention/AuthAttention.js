import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

function AuthAttention({ text }) {
  return (
    <div className="text-center mt-3 border border-black p-3 rounded">
      <FontAwesomeIcon icon={faExclamationTriangle} size="2x" color="black" />
      <p className="mt-2 mb-0">{text}</p>
    </div>
  );
}

export default AuthAttention;
