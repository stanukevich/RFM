import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

function RestaurantNotSelected() {
  return (
    <div className="text-center mt-3 border border-black p-3 rounded">
      <FontAwesomeIcon icon={faExclamationTriangle} size="2x" color="black" />
      <p className="mt-2 mb-0">You need to select a restaurant or create a new one to work with the Control Panel.</p>
      <ul className="list-unstyled text-center mt-2 mb-0">
        <li>On the left, there is an "Add" button to add a new restaurant.</li>
        <li>Once a restaurant is selected, you can edit or delete it.</li>
      </ul>
    </div>
  );
}

export default RestaurantNotSelected;
