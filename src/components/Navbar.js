// src/components/AppNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Form, FormControl, Badge } from "react-bootstrap";
import { Cart } from "react-bootstrap-icons";
import { useSearch } from "../context/SearchContext";
import { useCart } from "../context/CartContext"; // ✅ import Cart context

function AppNavbar() {
  const [expanded, setExpanded] = useState(false);
  const navRef = useRef(null);

  const { searchTerm, setSearchTerm } = useSearch();
  const { totalItems } = useCart(); // ✅ get live cart count

  // Close menu if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      sticky="top"
      ref={navRef}
      style={{
        background: "#212529",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          style={{
            fontWeight: "bold",
            fontSize: "1.6rem",
            letterSpacing: "1px",
            color: "#f8f9fa",
          }}
        >
          MyStore
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(expanded ? false : "expanded")}
        />
        <Navbar.Collapse id="basic-navbar-nav" className="custom-slide">
          <Nav className="ms-auto nav-mobile-center">
            {["/", "/products", "/cart", "/account"].map((path, idx) => {
              const labels = ["Home", "Products", "Cart", "Account"];
              return (
                <Nav.Link
                  key={path}
                  as={Link}
                  to={path}
                  style={{ color: "#f8f9fa", transition: "0.3s" }}
                  className="nav-hover"
                  onClick={() => setExpanded(false)}
                >
                  {labels[idx] === "Cart" ? (
                    <>
                      <Cart style={{ marginRight: "5px" }} /> Cart
                      {totalItems > 0 && (
                        <Badge bg="danger" pill className="ms-2">
                          {totalItems}
                        </Badge>
                      )}
                    </>
                  ) : (
                    labels[idx]
                  )}
                </Nav.Link>
              );
            })}
          </Nav>

          {/* Search Bar */}
          <Form className="d-flex ms-lg-3 mt-3 mt-lg-0">
            <FormControl
              type="search"
              placeholder="Search products..."
              className="me-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form>
        </Navbar.Collapse>
      </Container>

      <style>{`
        .nav-hover:hover {
          color: #0d6efd !important;
          transform: translateY(-2px);
        }
        @media (max-width: 991px) {
          .custom-slide {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 250px;
            background: #212529;
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
            padding-top: 80px;
            box-shadow: 2px 0 8px rgba(0,0,0,0.4);
            z-index: 1050;
          }
          .navbar-collapse.show {
            transform: translateX(0);
          }
          .nav-mobile-center {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
            height: calc(100% - 80px);
          }
          .nav-mobile-center .nav-link {
            font-size: 1.2rem;
            padding: 10px 0;
            width: 100%;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          .nav-mobile-center .nav-link:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </Navbar>
  );
}

export default AppNavbar;
