import { useEffect } from 'react'
import './MovieModal.css'

function MovieModal({ movie, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  if (!movie) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">
          <div className="modal-poster">
            {movie.Poster !== 'N/A' ? (
              <img src={movie.Poster} alt={movie.Title} />
            ) : (
              <div className="no-poster-large">Нет постера</div>
            )}
          </div>
          <div className="modal-details">
            <h2 className="modal-title">{movie.Title}</h2>
            <div className="modal-info">
              <p><strong>Год:</strong> {movie.Year}</p>
              <p><strong>Рейтинг:</strong> {movie.imdbRating || 'N/A'}</p>
              <p><strong>Жанр:</strong> {movie.Genre || 'N/A'}</p>
              <p><strong>Режиссер:</strong> {movie.Director || 'N/A'}</p>
              <p><strong>Актеры:</strong> {movie.Actors || 'N/A'}</p>
              <p><strong>Сюжет:</strong></p>
              <p className="modal-plot">{movie.Plot || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieModal

