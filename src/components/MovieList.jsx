import MovieCard from './MovieCard'
import './MovieList.css'

function MovieList({ movies, onSelectMovie }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="movie-list-empty">
        <p>Фильмы не найдены. Попробуйте другой запрос.</p>
      </div>
    )
  }

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} onSelect={onSelectMovie} />
      ))}
    </div>
  )
}

export default MovieList

