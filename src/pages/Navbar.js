import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Navbar as BsNavbar, Container, Nav, Badge, Form } from "react-bootstrap";
import { Cart, Search, HouseDoorFill, BoxSeamFill, PersonCircle } from "react-bootstrap-icons";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import "./Navbar.css";

const Navbar = () => {
  const { totalItems } = useCart();
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <BsNavbar expand="md" fixed="top" className="custom-navbar shadow-sm bg-white py-3">
      <Container>
        {/* Logo */}
        <BsNavbar.Brand as={Link} to="/" className="fw-bold fs-4 text-primary">
          MyStore
        </BsNavbar.Brand>

        {/* Toggle for mobile */}
        <BsNavbar.Toggle aria-controls="main-navbar" />

        <BsNavbar.Collapse id="main-navbar" className="justify-content-end">
          {/* Navigation Links */}
          <Nav className="nav-links me-3 fw-semibold">
            <Nav.Link as={NavLink} to="/" end>
              <HouseDoorFill className="me-1" size={20} /> Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/products">
              <BoxSeamFill className="me-1" size={20} /> Shop Now
            </Nav.Link>
            <Nav.Link as={NavLink} to="/account">
              <PersonCircle className="me-1" size={20} /> My Profile
            </Nav.Link>
          </Nav>

          {/* Search Box */}
          <Form className="d-flex align-items-center me-3 bg-light px-3 rounded-pill shadow-sm"
            style={{ minWidth: "250px" }}
          >
            <Search className="text-muted me-2" size={18} />
            <Form.Control
              type="search"
              placeholder="Search products..."
              className="border-0 bg-transparent shadow-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form>

          {/* Cart Icon */}
          <Nav>
            <Nav.Link as={NavLink} to="/cart" className="position-relative">
              <Cart size={24} />
              {totalItems > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {totalItems}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
