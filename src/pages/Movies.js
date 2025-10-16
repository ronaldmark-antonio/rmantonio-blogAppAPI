import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import { useGlobalStore } from '../UserContext';

export default function MoviesPage() {
  const { user } = useGlobalStore();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!user.isLoading) {
        try {
          const endpoint = user.isAdmin ? '/movies' : '/movies';
          const response = await axios.get(endpoint);
          setMovies(response.data);
        } catch (error) {
          console.error('Error fetching movies:', error);
        }
      }
    };

    fetchMovies();
  }, [user]);

  if (user.isLoading) return <p>Loading...</p>;

return (
  <div className="container">
    {user.isAdmin ? (
      <AdminView moviesData={movies} />
    ) : (
      <UserView moviesData={movies} />
    )}
  </div>
);

}
