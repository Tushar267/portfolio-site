import React from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cartItems, setQty, removeItem, clearCart, totalItems, totalPrice } = useCart();

  return (
    <Container className="py-4">
      <h2 className="mb-4">Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-muted">Your cart is empty.</div>
      ) : (
        <>
          <Table hover responsive className="bg-white shadow-sm">
            <thead>
              <tr>
                <th>Item</th>
                <th style={{ width: 120 }}>Price</th>
                <th style={{ width: 160 }}>Qty</th>
                <th style={{ width: 140 }}>Subtotal</th>
                <th style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((it) => (
                <tr key={it.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={it.image || "https://via.placeholder.com/64"}
                        alt={it.name}
                        width={64}
                        height={64}
                        className="me-3 rounded"
                        style={{ objectFit: "cover" }}
                      />
                      <div>{it.name}</div>
                    </div>
                  </td>
                  <td>₹{Number(it.price).toLocaleString("en-IN")}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Button size="sm" variant="outline-secondary" onClick={() => setQty(it.id, it.qty - 1)}>-</Button>
                      <input
                        type="number"
                        value={it.qty}
                        min={1}
                        onChange={(e) => setQty(it.id, Number(e.target.value))}
                        className="form-control mx-2"
                        style={{ width: 72 }}
                      />
                      <Button size="sm" variant="outline-secondary" onClick={() => setQty(it.id, it.qty + 1)}>+</Button>
                    </div>
                  </td>
                  <td>₹{(Number(it.price) * it.qty).toLocaleString("en-IN")}</td>
                  <td>
                    <Button variant="outline-danger" size="sm" onClick={() => removeItem(it.id)}>Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Row className="mt-3">
            <Col md={6} className="mb-3">
              <Button variant="outline-secondary" onClick={clearCart}>Clear Cart</Button>
            </Col>
            <Col md={6} className="text-end">
              <div className="fw-semibold">Items: {totalItems}</div>
              <div className="fs-5">Total: ₹{totalPrice.toLocaleString("en-IN")}</div>
              <Button className="mt-2" variant="success">Checkout</Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default CartPage;
