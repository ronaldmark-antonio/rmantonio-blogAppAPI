import { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Form, Pagination } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function AdminView() {
  const notyf = useRef(new Notyf()).current;

  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;

  const [newMovie, setNewMovie] = useState({
    title: '',
    director: '',
    year: '',
    description: '',
    genre: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('https://movieapp-api-lms1.onrender.com/movies/getMovies', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch movies');

        const data = await res.json();
        setMovies(Array.isArray(data.movies) ? data.movies : []);
      } catch (err) {
        console.error('Error loading movies:', err);
        alert('Could not load movies.');
      }
    };

    fetchMovies();
  }, [token]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setNewMovie({
      ...newMovie,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://movieapp-api-lms1.onrender.com/movies/addMovie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMovie),
      });

      if (!res.ok) throw new Error('Failed to add movie');

      const fetchMovies = async () => {
        const res = await fetch('https://movieapp-api-lms1.onrender.com/movies/getMovies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setMovies(Array.isArray(data.movies) ? data.movies : []);
      };

      await fetchMovies();
      notyf.success('Movie added successfully!');

      setNewMovie({
        title: '',
        director: '',
        year: '',
        description: '',
        genre: '',
      });

      handleClose();
    } catch (err) {
      console.error('Error adding movie:', err);
      notyf.error('Could not add movie.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const indexOfLast = currentPage * moviesPerPage;
  const indexOfFirst = indexOfLast - moviesPerPage;
  const currentMovies = [...movies].reverse().slice(indexOfFirst, indexOfLast);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-dark">Admin Dashboard</h2>
        <div>
          <Button variant="danger" onClick={handleShow} className="me-2" id="addMovie">
            + Add Movie
          </Button>
          <Button variant="dark" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Director</th>
            <th>Year</th>
            <th>Description</th>
            <th>Genre</th>
          </tr>
        </thead>
        <tbody>
          {currentMovies.length > 0 ? (
            currentMovies.map((movie, index) => (
              <tr key={movie._id || index}>
                <td>{indexOfFirst + index + 1}</td>
                <td>{movie.title || 'Untitled'}</td>
                <td>{movie.director || 'N/A'}</td>
                <td>{movie.year || 'N/A'}</td>
                <td>{movie.description || 'No description'}</td>
                <td>{movie.genre || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No movies found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            return (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => handlePageChange(page)}
                className={`${
                  page === currentPage ? 'bg-white text-white' : 'bg-white text-white'
                } border-0 mx-1`}
              >
                {page}
              </Pagination.Item>
            );
          })}
        </Pagination>
      )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Movie</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddMovie}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newMovie.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                name="director"
                value={newMovie.director}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                name="year"
                value={newMovie.year}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={newMovie.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                name="genre"
                value={newMovie.genre}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" type="submit" id="addMovie">
              Add Movie
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
