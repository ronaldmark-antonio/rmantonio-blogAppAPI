import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Container, Breadcrumb, Button, ListGroup } from 'react-bootstrap';


export default function ViewMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`https://movieapp-api-lms1.onrender.com/movies/getMovie/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch movie details');
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, token]);

  if (loading) return <Container className="py-4"><p>Loading movie details...</p></Container>;
  if (error) return <Container className="py-4"><p>Error: {error}</p></Container>;
  if (!movie) return <Container className="py-4"><p>No movie found.</p></Container>;

  return (
    <Container className="py-4" style={{ maxWidth: '700px' }}>
      {/* Breadcrumbs */}
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/movies' }}>
          Movies
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{movie.title || 'Untitled'}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Movie Card */}
      <Card className="shadow-sm">
        <Card.Header as="h4">{movie.title || 'Untitled'}</Card.Header>
        <Card.Body>
          <Card.Text><strong>Directed by:</strong> {movie.director || 'Unknown Director'}</Card.Text>
          <Card.Text><strong>Year:</strong> {movie.year || 'Unknown Year'}</Card.Text>
          <Card.Text><strong>Genre:</strong> {movie.genre || 'N/A'}</Card.Text>
          <Card.Text><strong>Description:</strong> {movie.description || 'No description available.'}</Card.Text>

          {/* Comments List */}
          {movie.comments && movie.comments.length > 0 && (
            <>
              <strong>Comments:</strong>
              <ListGroup variant="flush" className="mb-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {movie.comments.map((c) => (
                  <ListGroup.Item key={c._id}>{c.comment}</ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}

          {/* Back Button */}
          <Button variant="danger" onClick={() => navigate('/movies')}>
            &larr; Back to Movies
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
