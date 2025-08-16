import React from "react";
import { Card, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom"; // ✅ import Link

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  return (
    <Card className="h-100 shadow-sm">
      <Link to={`/product/${product.id}`}>  {/* ✅ link to details page */}
        <Card.Img
          variant="top"
          src={product.imageUrl}
          alt={product.name}
          style={{ objectFit: "cover", height: "250px" }}
        />
      </Link>
      <Card.Body className="d-flex flex-column">
        <Card.Title>
          <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
            {product.name}
          </Link>
        </Card.Title>
        <Card.Text className="text-muted">{product.category}</Card.Text>
        <Card.Text className="fw-bold">₹{product.price}</Card.Text>
        <Button
          variant="success"
          onClick={() => addItem(product)}
          className="mt-auto"
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
