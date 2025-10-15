import { useState, useEffect, useContext, useRef } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import UserContext from '../UserContext';

export default function Register() {
  const notyf = useRef(new Notyf()).current;
  const { user } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isActive, setIsActive] = useState(false);

  function registerUser(e) {
    e.preventDefault();

    fetch('https://fitnessapi-antonio.onrender.com/users/register', {
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
        if (data.message === 'Registered Successfully') {
          setEmail('');
          setPassword('');
          setConfirmPassword('');

          notyf.success('Registration Successful!');
        } else if (data.error === 'Password must be atleast 8 characters') {
        	notyf.error('Password must be atleast 8 characters');
        } else {
          notyf.error('Something went wrong. Please try again.');
        }
      })
      .catch(() => notyf.error('Network error. Please try again.'));
  }

  useEffect(() => {
    if (
      email !== '' &&
      password !== '' &&
      confirmPassword !== '' &&
      password === confirmPassword
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password, confirmPassword]);

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0 rounded-1">
            <Card.Body className="p-5">
              <h2 className="text-center fw-bold mb-4 text-primary">Register</h2>

              <Form onSubmit={registerUser}>
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
                    variant="primary"
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
                    className="text-decoration-none fw-semibold text-primary"
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
