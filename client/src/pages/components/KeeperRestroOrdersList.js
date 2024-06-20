import React, { useState } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faUtensils, faTrash } from '@fortawesome/free-solid-svg-icons';

const KeeperRestroOrdersList = () => {
    const orders = [
        { tableNumber: 1, totalCost: 25.5, employeeName: 'John Doe' },
        { tableNumber: 2, totalCost: 32.0, employeeName: 'Jane Smith' },
        { tableNumber: 3, totalCost: 18.75, employeeName: 'Michael Johnson' },
        { tableNumber: 4, totalCost: 25.5, employeeName: 'John Doe' },
        { tableNumber: 5, totalCost: 32.0, employeeName: 'Jane Smith' },
        { tableNumber: 6, totalCost: 18.75, employeeName: 'Michael Johnson' }        
    ];

    const [page, setPage] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const pageSize = 3;

    const totalPages = Math.ceil(orders.length / pageSize);

    const handleNextPage = () => {
        setPage(prevPage => Math.min(prevPage + 1, totalPages - 1));
    };

    const handlePrevPage = () => {
        setPage(prevPage => Math.max(prevPage - 1, 0));
    };

    const handleFastOrder = () => {
        console.log("Fast Order");
    };

    const handleOrderClick = (order) => {
        if (selectedOrder && selectedOrder.tableNumber === order.tableNumber) {
            setSelectedOrder(null);
        } else {
            setSelectedOrder(order);
        }
    };

    const handleDeleteOrder = () => {
        console.log("Delete Order", selectedOrder);
        setSelectedOrder(null);
    };

    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const currentOrders = orders.slice(startIndex, endIndex);

    return (
        <div style={{ width: '300px', height: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginRight: '20px' }}>
            <header className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <h5 className="mb-0">Orders List</h5>
                <div>
                    {selectedOrder && (
                        <Button variant="outline-dark" onClick={handleDeleteOrder} className="me-2">
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    )}
                    <Button variant="outline-dark" onClick={handleFastOrder}>
                        <FontAwesomeIcon icon={faUtensils} />
                    </Button>
                </div>
            </header>
            <div>
                {currentOrders.map((order, index) => (
                    <div
                        key={index}
                        onClick={() => handleOrderClick(order)}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            padding: '10px',
                            marginBottom: '10px',
                            backgroundColor: selectedOrder && selectedOrder.tableNumber === order.tableNumber ? '#e0e0e0' : 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <p>Table: {order.tableNumber}</p>
                        <p>Total Cost: ${order.totalCost}</p>
                        <p>Employee: {order.employeeName}</p>
                    </div>
                ))}
            </div>
            <footer className="mt-3 border-top pt-2 d-flex justify-content-center align-items-center">
                <div>
                    <Button variant="outline-dark" onClick={handlePrevPage} disabled={page === 0}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </Button>
                    <span className="mx-2">
                        <Badge bg="dark">{page + 1}</Badge>
                    </span>
                    <Button variant="outline-dark" onClick={handleNextPage} disabled={page === totalPages - 1}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </Button>
                </div>
            </footer>
        </div>
    );
};

export default KeeperRestroOrdersList;
