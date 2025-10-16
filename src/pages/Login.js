import { useState, useEffect, useContext, useRef } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import UserContext from '../UserContext';

export default function Login() {

const notyf = useRef(new Notyf()).current;
const { setUser } = useContext(UserContext);
const navigate = useNavigate();

useEffect(() => {
	const token = localStorage.getItem('token');
	if (token) {

	  // navigate('/movies', { replace: true });
	
	}
}, [navigate]);

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const isActive = email !== '' && password !== '';

const authenticate = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('https://movieapp-api-lms1.onrender.com/users/login', {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.access) {

			notyf.success('Successful Login');

      localStorage.setItem('token', data.access);

      await retrieveUserDetails(data.access);

      navigate('/movies');

    } else if (data.message === 'Email and password do not match') {
      	
      	notyf.error('Incorrect credentials. Try Again.');

    } else {
      	
      	notyf.error(data.message || 'User Not Found. Try Again.');
    }
  } catch {
    
    		notyf.error('Network error. Please try again.');
  }

  setEmail('');
  setPassword('');
};

const retrieveUserDetails = async (token) => {
  try {
    const res = await fetch('https://movieapp-api-lms1.onrender.com/users/details', {
      headers: { 
      	Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (data.user) {
      const userData = {
        id: data.user._id,
        isAdmin: data.user.isAdmin,
        isLoading: false,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  } catch {
    console.error('Failed to retrieve user details.');
  }
};


return (
<Container className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
  <Row className="w-100 justify-content-center">
    <Col md={6} lg={5}>
      <Card className="shadow-lg border-0 rounded-1">
        <Card.Body className="p-5">
          <h2 className="text-center fw-bold mb-4 text-danger">Login</h2>

          <Form onSubmit={authenticate}>
            <Form.Group controlId="userEmail" className="mb-3">
              <Form.Label>Email Address:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-4">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button
                variant="danger"
                type="submit"
                disabled={!isActive}
                size="lg"
                className="rounded-3"
              >
                Submit
              </Button>
            </div>
          </Form>

          <div className="text-center mt-4">
            <p className="mb-0">
              Don’t have an account?{' '}
              <a href="/register" className="text-decoration-none fw-semibold text-danger">
                Register
              </a>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Container>
);
}
