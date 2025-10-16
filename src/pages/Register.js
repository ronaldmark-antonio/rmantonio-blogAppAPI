import { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function Register() {

const notyf = useRef(new Notyf()).current; 
const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    
    // navigate('/workouts', { replace: true });
  
  }
}, [navigate]);


const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [isActive, setIsActive] = useState(false);

const registerUser = async (e) => {
	e.preventDefault();

	try {
		const res = await fetch('https://movieapp-api-lms1.onrender.com/users/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password, isAdmin: false }),
		});

		const data = await res.json();
		if (data.message === 'Registered Successfully') {
			
			notyf.success('Registration Successful!');
			
			setEmail('');
			setPassword('');
			setConfirmPassword('');
			
			navigate('/login');

		} else if (data.error === 'Password must be atleast 8 characters') {

			notyf.error('Password must be at least 8 characters');

		} else {
			
			notyf.error('Something went wrong. Please try again.');
		}

	} catch {

		notyf.error('Network error. Please try again.');
	}
};

useEffect(() => {

	setIsActive(
		email !== '' && password !== '' && confirmPassword !== '' && password === confirmPassword
	);

}, [email, password, confirmPassword]);

return (
	<Container className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
	  <Row className="w-100 justify-content-center">
	    <Col md={6} lg={5}>
	      <Card className="shadow-lg border-0 rounded-1">
	        <Card.Body className="p-5">
	          <h2 className="text-center fw-bold mb-4 text-danger">Register</h2>

	          <Form onSubmit={registerUser}>
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

	            <Form.Group controlId="password" className="mb-3">
	              <Form.Label>Password:</Form.Label>
	              <Form.Control
	                type="password"
	                placeholder="Enter your password"
	                value={password}
	                onChange={(e) => setPassword(e.target.value)}
	                required
	              />
	            </Form.Group>

	            <Form.Group controlId="confirmPassword" className="mb-4">
	              <Form.Label>Confirm Password:</Form.Label>
	              <Form.Control
	                type="password"
	                placeholder="Confirm your password"
	                value={confirmPassword}
	                onChange={(e) => setConfirmPassword(e.target.value)}
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
	              Already have an account?{' '}
	              <a
	                href="/login"
	                className="text-decoration-none fw-semibold text-danger"
	              >
	                Login
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
