import React, { useState, useMemo, useEffect } from "react";
import { Container, Row, Col, Button, Card, Spinner, Alert } from "react-bootstrap";
import { useSearch } from "../context/SearchContext";
import { useCart } from "../context/CartContext";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Products = () => {
  const categories = ["All", "Men", "Women", "Kids"];
  const { searchTerm } = useSearch();
  const { addItem, cartItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products from Firestore
  useEffect(() => {
  setLoading(true);
  setError("");
  const coll = collection(db, "products");
  let q;

  if (selectedCategory === "All") {
    q = query(coll); // ✅ No orderBy
  } else {
    q = query(coll, where("category", "==", selectedCategory)); // ✅ No orderBy
  }

  const unsub = onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAtDate: doc.data().createdAt?.toDate?.() || new Date(0),
      }));
      console.log("Fetched products:", list);
      setProducts(list);
      setLoading(false);
    },
    (err) => {
      console.error("Firestore error:", err);
      setError("Failed to load products. Please check Firestore data.");
      setLoading(false);
    }
  );

  return () => unsub();
}, [selectedCategory]);


  // Filter by search
  const filteredProducts = useMemo(() => {
    const term = (searchTerm || "").trim().toLowerCase();
    return products.filter((p) => {
      const cat = (p.category || "").toLowerCase().trim();
      const matchesSearch =
        term === "" ||
        (p.name || "").toLowerCase().includes(term) ||
        cat.includes(term);
      return matchesSearch;
    });
  }, [products, searchTerm]);

  // Recently added + remaining
  const recentProducts = filteredProducts.slice(0, 5);
  const remainingProducts = filteredProducts.slice(5);

  // Render product card
  const renderProductCard = (product) => {
    const inCart = cartItems.find((c) => c.id === product.id);
    return (
      <Col md={4} sm={6} xs={12} key={product.id} className="mb-4">
        <Card className="shadow-sm border-0 h-100">
          <Card.Img
            loading="lazy"
            alt={product.name}
            variant="top"
            src={product.image || "https://via.placeholder.com/320"}
            style={{ height: "320px", objectFit: "cover" }}
          />
          <Card.Body>
            <Card.Title className="fw-semibold">{product.name}</Card.Title>
            <div className="text-muted small mb-2">
              {product.createdAtDate.getTime() > 0 &&
                product.createdAtDate.toLocaleDateString()}
            </div>
            <Card.Text className="text-primary fw-bold">
              {product.price
                ? `₹${Number(product.price).toLocaleString("en-IN")}`
                : "Price not set"}
            </Card.Text>
            <Button
              variant={inCart ? "outline-success" : "success"}
              className="w-100"
              onClick={() => addItem(product)}
            >
              {inCart ? `In Cart (${inCart.qty})` : "Add to Cart"}
            </Button>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <Container className="py-5">
      <h2 className="text-center fw-bold mb-4">Our Clothing Collection</h2>

      {/* Category Buttons */}
      <div className="text-center mb-3">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "primary" : "outline-primary"}
            className="mx-2 mb-2"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-5 text-muted">No products found.</div>
      ) : (
        <>
          {recentProducts.length > 0 && (
            <>
              <h4 className="mb-3">🆕 Recently Added</h4>
              <Row>{recentProducts.map(renderProductCard)}</Row>
            </>
          )}

          {remainingProducts.length > 0 && (
            <>
              <h4 className="mt-5 mb-3">All Products</h4>
              <Row>{remainingProducts.map(renderProductCard)}</Row>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default Products;
