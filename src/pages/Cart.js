// src/pages/Cart.js
import React from "react";
import { Container, Table, Button, Image, Row, Col } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function CartPage() {
  const {
    cartItems,
    updateItemQty,
    removeItem,
    clearCart,
    totalAmount,
    formatPrice,
  } = useCart();

  if (!cartItems || cartItems.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2>Your cart is empty</h2>
        <p className="text-muted">Add some items from the shop to get started.</p>
        <Button as={Link} to="/products" variant="primary">
          Shop Products
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Your Cart</h2>
      <Table responsive bordered hover>
        <thead className="table-dark">
          <tr>
            <th style={{ minWidth: 240 }}>Product</th>
            <th>Price</th>
            <th style={{ width: 140 }}>Qty</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="d-flex align-items-center">
                  <Image
                    src={item.image || "https://via.placeholder.com/80"}
                    rounded
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                    }}
                    className="me-3"
                  />
                  <div>
                    <div className="fw-semibold">{item.name}</div>
                  </div>
                </div>
              </td>
              <td>{formatPrice(item.price)}</td>
              <td>
                <div className="d-flex align-items-center">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => updateItemQty(item.id, item.qty - 1)}
                  >
                    -
                  </Button>
                  <div className="px-3">{item.qty}</div>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => updateItemQty(item.id, item.qty + 1)}
                  >
                    +
                  </Button>
                </div>
              </td>
              <td>{formatPrice(item.price * item.qty)}</td>
              <td>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Row className="mt-3">
        <Col md={6}>
          <Button variant="outline-danger" onClick={clearCart}>
            Clear Cart
          </Button>
        </Col>
        <Col md={6} className="text-end">
          <div className="mb-2">
            Total: <strong>{formatPrice(totalAmount)}</strong>
          </div>
          <Button variant="success">Proceed to Checkout</Button>
        </Col>
      </Row>
    </Container>
  );
}
