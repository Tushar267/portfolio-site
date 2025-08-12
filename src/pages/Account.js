// src/pages/Account.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Spinner,
  Table,
  Image,
  Nav,
  Tab,
  Row,
  Col,
} from "react-bootstrap";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  PersonCircle,
  BoxSeam,
  Heart,
  Gear,
  BoxArrowRight,
} from "react-bootstrap-icons";

function mapFirebaseError(code) {
  switch (code) {
    case "auth/user-not-found":
      return "No account found for this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/email-already-in-use":
      return "Email already in use.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    default:
      return "Authentication error. " + code;
  }
}

export default function Account() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const [orders] = useState([
    { id: "001", date: "2025-08-05", total: "$59.99", status: "Delivered" },
    { id: "002", date: "2025-08-07", total: "$120.50", status: "Pending" },
  ]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        if (name && auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: name });
        }
      }
    } catch (err) {
      setError(mapFirebaseError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (user) {
    return (
      <Container className="py-5">
        <Card className="shadow-lg border-0 p-3">
          <Tab.Container defaultActiveKey="profile">
            <Row>
              {/* Sidebar Navigation */}
              <Col md={3} className="mb-4 mb-md-0 border-end">
                <div className="text-center mb-4">
                  <Image
                    src={user.photoURL || "https://via.placeholder.com/100"}
                    roundedCircle
                    width={100}
                    height={100}
                    className="border border-3 shadow-sm"
                  />
                  <h5 className="mt-3">{user.displayName || "User"}</h5>
                  <small className="text-muted">{user.email}</small>
                </div>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="profile">
                      <PersonCircle className="me-2" /> Profile
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="orders">
                      <BoxSeam className="me-2" /> Orders
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="wishlist">
                      <Heart className="me-2" /> Wishlist
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="settings">
                      <Gear className="me-2" /> Settings
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Button
                      variant="outline-danger"
                      className="w-100 mt-3"
                      onClick={handleLogout}
                    >
                      <BoxArrowRight className="me-2" /> Logout
                    </Button>
                  </Nav.Item>
                </Nav>
              </Col>

              {/* Content Area */}
              <Col md={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="profile">
                    <h4>Profile Information</h4>
                    <p>Manage your account details here.</p>
                  </Tab.Pane>

                  <Tab.Pane eventKey="orders">
                    <h4>Recent Orders</h4>
                    <Table striped hover responsive className="mt-3">
                      <thead className="table-dark">
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{new Date(order.date).toLocaleDateString()}</td>
                            <td>
                              <span
                                className={`badge bg-${
                                  order.status === "Delivered"
                                    ? "success"
                                    : order.status === "Pending"
                                    ? "warning text-dark"
                                    : "secondary"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td>{order.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Tab.Pane>

                  <Tab.Pane eventKey="wishlist">
                    <h4>Your Wishlist</h4>
                    <p>No wishlist items yet.</p>
                  </Tab.Pane>

                  <Tab.Pane eventKey="settings">
                    <h4>Account Settings</h4>
                    <p>Update your preferences and password here.</p>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Card>
      </Container>
    );
  }

  // Login / Register Form
  return (
  <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
    <Card className="p-4 shadow-lg border-0" style={{ maxWidth: "420px", borderRadius: "15px" }}>
      <h3 className="text-center mb-4 fw-bold text-primary">
        {isLogin ? "Login to Your Account" : "Create a New Account"}
      </h3>

      {error && (
        <div className="alert alert-danger text-center py-2">{error}</div>
      )}

      <Form onSubmit={handleAuth} className="mt-3">
        {!isLogin && (
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
              className="rounded-pill px-3 py-2"
            />
          </Form.Group>
        )}

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-pill px-3 py-2"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-pill px-3 py-2"
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100 py-2 rounded-pill fw-semibold"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden
              />
              <span className="ms-2">Please wait...</span>
            </>
          ) : isLogin ? (
            "Login"
          ) : (
            "Register"
          )}
        </Button>
      </Form>

      <div className="text-center mt-4">
        <Button
          variant="link"
          className="text-decoration-none fw-semibold"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Button>
      </div>
    </Card>
  </Container>
);
}
