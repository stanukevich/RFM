import React, { useState } from 'react';
import KeeperOrderModal from '../modal/KeeperOrderModal';

const KeeperRestroSystemTables = ({ tables, restaurantId, systemUserId, menuItems, orders, systemUser }) => {
  const tableSize = 50;
  const mapWidth = 600;
  const mapHeight = 600;

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedTableNumber, setSelectedTableNumber] = useState(null);

  const handleTableClick = (tableNumber) => {
    console.log('Номер столика:', tableNumber);
    setSelectedTableNumber(tableNumber);
    setShowOrderModal(true);
  };

  const handleCloseModal = () => {
    setShowOrderModal(false);
    setSelectedTableNumber(null);
  };

  // Фильтруем заказы для выбранного столика
  const filteredOrders = orders.filter(order => {
    const table = tables.find(table => table.tableNumber === selectedTableNumber);
    return table ? order.tableId === table.id : false;
  });

  return (
    <div>
      <div
        className="table-map-container border"
        style={{ position: 'relative', width: mapWidth, height: mapHeight, margin: 'auto', padding: 0, outline: 'none' }}
      >
        {tables.map(table => {
          const tableStyle = {
            left: table.xCoordinate,
            top: table.yCoordinate,
            width: tableSize,
            height: tableSize,
            cursor: 'pointer',
            transition: 'background-color 0.3s, color 0.3s',
          };

          let backgroundColor = 'white';
          let color = 'black';
          let border = "1px black dashed";

          const tableOrders = orders.filter(order => order.tableId === table.id);
          const hasOrders = tableOrders.length > 0;
          const hasUnsentOrders = tableOrders.some(order => order.OrderMenuItems && order.OrderMenuItems.length > 0 && order.OrderMenuItems.some(item => item.sendingStatus === false));

          if (hasOrders) {
              if (tableOrders.some(order => !order.OrderMenuItems || order.OrderMenuItems.length === 0)) {
              color = 'black'; // Меняем цвет текста на черный для читаемости
              border = '1px solid black'  
            }
              else if (hasUnsentOrders) {
              backgroundColor = 'lightgray'; // Используем цвет для столиков без OrderMenuItems
              color = 'black';
              border = '1px solid black'  
            } else if (tableOrders.every(order => order.precheckStatus === true)) {
              backgroundColor = 'black';
              color = 'white';
              border = '1px solid black'  
            } else {
              backgroundColor = 'gray';
              color = 'white';
              border = '1px solid black'  
            }
          }

          const tableStyleWithColors = { ...tableStyle, backgroundColor, color, border };

          return (
            <div
              key={table.id}
              className={`table-marker rounded d-flex justify-content-center align-items-center position-absolute`}
              style={tableStyleWithColors}
              onClick={() => handleTableClick(table.tableNumber)}
            >
              {table.tableNumber}
            </div>
          );
        })}
      </div>
      <KeeperOrderModal 
        showModal={showOrderModal} 
        handleCloseModal={handleCloseModal} 
        menuItems={menuItems} 
        initialOrders={filteredOrders} 
        restaurantId={restaurantId} 
        systemUserId={systemUserId}
        table={tables.find(table => table.tableNumber === selectedTableNumber)}
        systemUser={systemUser}
      />
    </div>
  );
};

export default KeeperRestroSystemTables;
