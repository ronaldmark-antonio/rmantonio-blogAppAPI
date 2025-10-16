export default function UserView({ moviesData }) {
  return (
    <div>
      <h2>User Movies</h2>
      <ul>
        {moviesData.map(movie => (
          <li key={movie._id || movie.id}>{movie.name}</li>
        ))}
      </ul>
    </div>
  );
}
