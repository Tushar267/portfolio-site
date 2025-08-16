import React, { useEffect, useState } from "react";
import { Container, Button, Row, Col, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/Home.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const normalizeCategory = (cat) => (cat ? cat.trim().toLowerCase() : "");

const matchesCategory = (cat, selected) => {
  if (selected === "all") return true;
  const normalized = normalizeCategory(cat);
  const target = normalizeCategory(selected);

  if (target === "men") {
    return /\bmen\b/.test(normalized) || normalized.includes("men's");
  }
  if (target === "women") {
    return /\bwomen\b/.test(normalized) || normalized.includes("women's");
  }
  if (target === "kids") {
    return /\bkids?\b/.test(normalized) || normalized.includes("children");
  }

  return normalized === target;
};

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unnamed Product",
            price: data.price || 0,
            category: data.category || "Other",
            imageUrl: data.imageUrl || data.image || "",
          };
        });
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ["Men", "Women", "Kids"];

  const handleAddToCart = (product) => {
    if (!currentUser) {
      alert("Please login to add products to cart.");
      navigate("/login");
      return;
    }
    addItem(product);

    // ✅ Show toast message
    setToastMessage(`"${product.name}" added to cart!`);
    setShowToast(true);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center mt-5 pt-4">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <div className="home-page">
      {/* Floating background icons */}
      <i className="bi bi-tshirt icon-bg"></i>
      <i className="bi bi-shirt icon-bg"></i>
      <i className="bi bi-bag icon-bg"></i>
      <i className="bi bi-basket icon-bg"></i>
      <i className="bi bi-handbag icon-bg"></i>
      <i className="bi bi-sunglasses icon-bg"></i>

      {/* ✅ Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="success"
          animation
        >
          <Toast.Header>
            <i className="bi bi-check-circle-fill text-success me-2"></i>
            <strong className="me-auto">Cart Updated</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {categories.map((cat, index) => {
        const filtered = products.filter((p) => matchesCategory(p.category, cat));
        if (filtered.length === 0) return null;

        return (
          <div
            key={cat}
            className="section-collection"
            style={{
              backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f9fa",
              borderTop: "1px solid #dee2e6",
              borderBottom: "1px solid #dee2e6",
            }}
          >
            <Container>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold m-0 text-primary">{cat} Collection</h2>
                <Button
                  as={Link}
                  to={`/products/${cat.toLowerCase()}`}
                  variant="outline-primary"
                  size="sm"
                  className="fw-semibold rounded-pill px-4"
                >
                  View All →
                </Button>
              </div>

              <Row className="g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
                {filtered.slice(0, 4).map((product) => (
                  <Col key={product.id} className="d-flex">
                    <div className="w-100 h-100">
                      <ProductCard
                        product={product}
                        onAddToCart={() => handleAddToCart(product)}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
