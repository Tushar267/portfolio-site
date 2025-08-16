import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Container, Row, Col, Button, Spinner, Card, Image } from "react-bootstrap";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h4>Product not found</h4>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="align-items-center">
        {/* Product Image */}
        <Col md={6} className="mb-4">
          <Card className="shadow-sm border-0 rounded-4">
            <Image
              src={product.imageUrl || product.image || "https://via.placeholder.com/400"}
              alt={product.name}
              fluid
              className="rounded-4"
            />
          </Card>
        </Col>

        {/* Product Info */}
        <Col md={6}>
          <h2 className="fw-bold text-dark">{product.name}</h2>
          <p className="text-muted">{product.category}</p>
          <h3 className="text-success fw-bold mb-4">₹{product.price}</h3>

          <Card className="p-3 shadow-sm border-0 mb-4 rounded-4">
            <h5 className="fw-bold text-dark">Description</h5>
            <p className="text-muted mb-0">
              {product.description || product.desc || "No description available."}
            </p>
          </Card>

          <div className="d-flex gap-3">
            <Button
              variant="success"
              size="lg"
              className="rounded-pill px-4 shadow-sm"
              onClick={() => addItem(product)}
            >
              🛒 Add to Cart
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              className="rounded-pill px-4"
            >
              ❤️ Wishlist
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;
