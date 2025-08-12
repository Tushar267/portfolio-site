import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="bg-light text-dark">
      <Container className="text-center py-5">
        <h1 className="display-4 fw-bold">Welcome to MyStore</h1>
        <p className="lead">Your one-stop shop for trendy clothes!</p>
        <Button as={Link} to="/products" variant="primary" size="lg">
          Shop Now
        </Button>
      </Container>
    </div>
  );
}

export default Home;
