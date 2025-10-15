import { useState, useEffect, useContext, useRef } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import UserContext from '../UserContext';

export default function Login() {
  const notyf = useRef(new Notyf()).current;
  const { user, setUser } = useContext(UserContext);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(true);

  function authenticate(e) {
    
    e.preventDefault();
    fetch('https://fitnessapi-antonio.onrender.com/users/login', {
		method: 'POST',
		headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		email: email,
		password: password,
		}),
    })
	.then((res) => res.json())
	.then((data) => {
		if (data.access !== undefined) {
			localStorage.setItem('token', data.access);
			retrieveUserDetails(data.access);
			notyf.success('Successful Login!');
		} else if (data.message === 'Email and password do not match') {
			notyf.error('Incorrect Credentials. Try Again.');
		} else {
			notyf.error('User Not Found. Try Again.');
		}
	});

    setEmail('');
    setPassword('');
  }

  const retrieveUserDetails = (token) => {
    fetch('https://fitnessapi-antonio.onrender.com/users/details', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
	.then((res) => res.json())
	.then((data) => {
	setUser({
	  id: data.user._id,
	});
	});
  };

  useEffect(() => {
    if (email !== '' && password !== '') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0 rounded-1">
            <Card.Body className="p-5">
              <h2 className="text-center fw-bold mb-4 text-primary">Login</h2>

              <Form onSubmit={authenticate}>
                <Form.Group controlId="userEmail" className="mb-3">
                  <Form.Label>Email address:</Form.Label>
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
                    variant={isActive ? 'primary' : 'primary'}
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
                  <a href="/register" className="text-decoration-none fw-semibold text-primary">
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
