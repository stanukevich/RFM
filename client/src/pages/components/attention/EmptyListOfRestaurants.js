import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

function EmptyListOfRestaurants() {
  return (
    <div className="text-center mt-3 border border-black p-3 rounded">
      <FontAwesomeIcon icon={faExclamationTriangle} size="2x" color="black" />
      <p className="mt-2 mb-0">You have no restaurants.</p>
      <p className="mt-2 mb-0">To create a restaurant, click the "Add" button.</p>
    </div>
  );
}

export default EmptyListOfRestaurants;
