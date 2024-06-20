import React, { useState } from 'react';
import { Modal, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const KeeperRevenueModal = ({ show, onHide, orders }) => {
  const [orderPage, setOrderPage] = useState(1);
  const ordersPerPage = 6;

  const startIndex = (orderPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentDisplayOrders = orders.slice(startIndex, endIndex);

  const nextPage = () => {
    if (endIndex < orders.length) {
      setOrderPage(orderPage + 1);
    }
  };

  const prevPage = () => {
    if (orderPage > 1) {
      setOrderPage(orderPage - 1);
    }
  };

  const canGoNext = endIndex < orders.length;
  const canGoPrev = orderPage > 1;

  const calculateRevenue = (orders) => {
    return orders.reduce(
      (acc, order) => {
        if (order.paymentType === 'card') {
          acc.card += order.amountPrice;
        } else if (order.paymentType === 'cash') {
          acc.cash += order.amountPrice;
        }
        acc.overall = acc.card + acc.cash;
        return acc;
      },
      { overall: 0, card: 0, cash: 0 }
    );
  };

  const revenue = calculateRevenue(orders);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header>
        <Modal.Title>Revenue Details</Modal.Title>
      </Modal.Header>
      <div className="mx-3 pt-3 d-flex align-items-center">
          <div className="pagination d-flex align-items-center">
            <Button variant="outline-dark" onClick={prevPage} disabled={!canGoPrev}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            <span className="mx-2 d-flex align-items-center">
              <Badge bg="dark">{orderPage}</Badge>
            </span>
            <Button variant="outline-dark" onClick={nextPage} disabled={!canGoNext}>
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </div>
        </div>
      <Modal.Body>
        <Card className="mb-4">
          <Card.Body>
            {orders.length === 0 && (
              <p className="text-center">No orders available.</p>
            )}
            <div style={{ padding: '15px', borderRadius: '5px' }}>
              <Row>
                {currentDisplayOrders.map((order) => (
                  <Col key={order.id} xs={12} sm={6} md={4} lg={4} className="mb-4">
                    <Card className="h-100 bg-light">
                      <Card.Body>
                        <Card.Title>Order #{order.id}</Card.Title>
                        <Card.Text>
                          Employee: {order.systemUser.name}<br />
                          Table #: {order.table.tableNumber}<br />
                          Amount: ${order.amountPrice}<br />
                          Payment: {order.paymentType}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Card.Body>
        </Card>
        <Card className="mt-4">
          <Card.Body>
            <Row>
              <Col>
                <h5>Total Revenue: ${revenue.overall.toFixed(2)}</h5>
                <p>Card: ${revenue.card.toFixed(2)}</p>
                <p>Cash: ${revenue.cash.toFixed(2)}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-dark" onClick={onHide} className="mx-auto">Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default KeeperRevenueModal;
