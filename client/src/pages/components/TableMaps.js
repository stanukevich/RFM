import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faArrowLeft, faArrowRight, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { CREATE_TABLE, DELETE_TABLE, UPDATE_TABLE, SYNC_TABLES } from '../../requests/req';

import userStore from '../../mobx/userStore.js';

function TableMaps({ tables, restaurantId }) {
  const [selectedTable, setSelectedTable] = useState(null);

  const tableSize = 50;
  const mapWidth = 600;
  const mapHeight = 600;

  const handleAddTable = async () => {
    try {
      const newTableNumber = tables.length + 1;
      const newTable = { tableNumber: newTableNumber, xCoordinate: (mapWidth - tableSize) / 2, yCoordinate: (mapHeight - tableSize) / 2, restaurantId };
      
      const response = await axios.post(CREATE_TABLE, newTable);
      
      if (response.status === 200) {
        userStore.loadTables(restaurantId);
      } else {
        console.error('Table creation failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding table:', error.response.data.message);
    }
  };
  
  const handleDeleteTable = async () => {
    if (selectedTable !== null) {
      try {
        const response = await axios.delete(DELETE_TABLE, { data: { tableId: selectedTable } });
        
        if (response.status === 200) {
          const updatedTables = tables.filter(table => table.id !== selectedTable);
          syncTables(updateTableNumbers(updatedTables));
          setSelectedTable(null);
          userStore.loadTables(restaurantId);
        } else {
          console.error('Error deleting table:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting table:', error);
      }
    }
  };

  const updateTableNumbers = (updatedTables) => {
    return updatedTables.map((table, index) => ({
      ...table,
      tableNumber: index + 1
    }));
  };

  const syncTables = async (updatedTables) => {
    try {
      const response = await axios.post(SYNC_TABLES, { tables: updatedTables, restaurantId });
      userStore.loadTables(restaurantId);
      if (response.status !== 200) {
        console.error('Error syncing tables:', response.statusText);
      }
    } catch (error) {
      console.error('Error syncing tables:', error);
    }
  };

  const handleTableClick = (id) => {
    setSelectedTable(selectedTable === id ? null : id);
  };

  const handleMoveTable = async (direction) => {
    if (selectedTable !== null) {
      try {
        const tableToUpdate = tables.find(table => table.id === selectedTable);
        if (!tableToUpdate) {
          console.error("Selected table not found");
          return;
        }
  
        let newX = tableToUpdate.xCoordinate;
        let newY = tableToUpdate.yCoordinate;
        switch (direction) {
          case 'left':
            newX = Math.max(0, newX - 10);
            break;
          case 'right':
            newX = Math.min(mapWidth - tableSize, newX + 10);
            break;
          case 'up':
            newY = Math.max(0, newY - 10);
            break;
          case 'down':
            newY = Math.min(mapHeight - tableSize, newY + 10);
            break;
          default:
            break;
        }
  
        const response = await axios.put(UPDATE_TABLE, { tableId: selectedTable, xCoordinate: newX, yCoordinate: newY });
        
        if (response.status === 200) {
          userStore.loadTables(restaurantId);
        } else {
          console.error('Error updating table coordinates:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating table coordinates:', error);
      }
    }
  };
  
  const handleKeyDown = (event) => {
    if (selectedTable !== null) {
      switch (event.key) {
        case 'ArrowLeft':
          handleMoveTable('left');
          break;
        case 'ArrowRight':
          handleMoveTable('right');
          break;
        case 'ArrowUp':
          handleMoveTable('up');
          break;
        case 'ArrowDown':
          handleMoveTable('down');
          break;
        default:
          break;
      }
    }
  };

  return (
    <div>
      <div
        className="table-map-container border mt-4"
        style={{ position: 'relative', width: mapWidth, height: mapHeight, margin: 'auto', padding: 0, outline: 'none' }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {tables.map(table => (
          <div
            key={table.id}
            className={`table-marker bg-${selectedTable === table.id ? 'dark' : 'light'} text-${selectedTable === table.id ? 'white' : 'black'} rounded d-flex justify-content-center align-items-center position-absolute border border-black`}
            style={{ left: table.xCoordinate, top: table.yCoordinate, width: tableSize, height: tableSize, cursor: 'pointer', transition: 'background-color 0.3s, color 0.3s' }}
            onClick={() => handleTableClick(table.id)}
          >
            {table.tableNumber}
          </div>
        ))}
      </div>
      <div className="mt-3" style={{ width: mapWidth, margin: 'auto' }}>
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <Button variant="outline-dark mx-1" onClick={() => handleMoveTable('left')} disabled={selectedTable === null}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <Button variant="outline-dark mx-1" onClick={() => handleMoveTable('right')} disabled={selectedTable === null}>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
            <Button variant="outline-dark mx-1" onClick={() => handleMoveTable('up')} disabled={selectedTable === null}>
              <FontAwesomeIcon icon={faArrowUp} />
            </Button>
            <Button variant="outline-dark mx-1" onClick={() => handleMoveTable('down')} disabled={selectedTable === null}>
              <FontAwesomeIcon icon={faArrowDown} />
            </Button>
          </div>
          <div>
            <Button variant="outline-dark mx-1" onClick={handleAddTable} disabled={selectedTable !== null}>
              <FontAwesomeIcon icon={faPlus} className="me-2" /> Add
            </Button>
            <Button variant="outline-dark mx-1" onClick={() => handleDeleteTable(selectedTable)} disabled={selectedTable === null}>
              <FontAwesomeIcon icon={faTrash} className="me-2" /> Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableMaps;
