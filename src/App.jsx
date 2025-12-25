import { useState, useRef } from 'react'
import SearchBar from './components/SearchBar'
import MovieList from './components/MovieList'
import MovieModal from './components/MovieModal'
import './style.css'

// Используем OMDb API (Open Movie Database) - бесплатный, 1000 запросов в день
// Получите бесплатный ключ: http://www.omdbapi.com/apikey.aspx
// Выберите план "FREE" и введите email
// Или используйте переменную окружения: VITE_OMDB_API_KEY=ваш_ключ
const API_KEY = import.meta.env.VITE_OMDB_API_KEY || '1401456d'
const SEARCH_API = `https://www.omdbapi.com/?apikey=${API_KEY}&type=movie&s=`
const DETAIL_API = `https://www.omdbapi.com/?apikey=${API_KEY}&i=`

function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const abortControllerRef = useRef(null)

  const searchMovies = async (query) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    try {
      setLoading(true)
      setError(null)
      setSelectedMovie(null)

      const url = `${SEARCH_API}${encodeURIComponent(query)}`
      console.log('Запрос к API:', url)
      
      const response = await fetch(url, { signal })
      
      console.log('Ответ получен, статус:', response.status)
      
      if (response.status === 401) {
        throw new Error('Ошибка авторизации API. Проверьте API ключ.')
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ошибка: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Данные получены:', data)
      
      if (data.Response === 'False') {
        const errorMsg = data.Error || 'Фильмы не найдены'
        console.error('Ошибка API:', errorMsg)
        
        if (errorMsg.includes('API key') || errorMsg.includes('Invalid API') || errorMsg.includes('Request limit')) {
          setError({ message: 'Ошибка API ключа. Получите бесплатный ключ на http://www.omdbapi.com/apikey.aspx (план FREE)' })
        } else if (errorMsg.includes('Too many results') || errorMsg.includes('too many')) {
          setError({ 
            message: 'Слишком много результатов. Попробуйте уточнить запрос: добавьте год выпуска или более конкретное название фильма.' 
          })
        } else {
          setError({ message: errorMsg })
        }
        setMovies([])
      } else {
        const moviesList = data.Search || []
        console.log('Найдено фильмов:', moviesList.length)
        setMovies(moviesList)
        setError(null)
      }
    } catch (err) {
      console.error('Ошибка при запросе:', err)
      
      if (err.name !== 'AbortError') {
        let errorMessage = 'Ошибка при загрузке данных'
        
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          errorMessage = 'Ошибка сети: не удалось подключиться к серверу. Проверьте подключение к интернету.'
        } else if (err.name === 'SyntaxError') {
          errorMessage = 'Ошибка парсинга данных от сервера'
        } else if (err.message) {
          errorMessage = err.message
        }
        
        setError({ message: errorMessage })
        setMovies([])
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchMovieDetails = async (imdbID) => {
    try {
      setLoading(true)
      setError(null)
      
      const url = `${DETAIL_API}${imdbID}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Ошибка при загрузке деталей фильма')
      }

      const data = await response.json()
      
      if (data.Response === 'True') {
        setSelectedMovie(data)
      } else {
        setError({ message: data.Error || 'Не удалось загрузить детали фильма' })
      }
    } catch (err) {
      setError({ message: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectMovie = (imdbID) => {
    fetchMovieDetails(imdbID)
  }

  const handleCloseModal = () => {
    setSelectedMovie(null)
  }

  return (
    <div className="app">
      <h1>Каталог фильмов</h1>
      <SearchBar onSearch={searchMovies} />
      
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Загрузка...</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{error.message}</p>
          {error.message.includes('API') && (
            <div className="error-instructions">
              <p><strong>📋 Пошаговая инструкция получения бесплатного API ключа OMDb:</strong></p>
              <ol>
                <li>Перейдите на <a href="http://www.omdbapi.com/apikey.aspx" target="_blank" rel="noopener noreferrer">omdbapi.com/apikey.aspx</a></li>
                <li>Нажмите на кнопку <strong>"FREE"</strong> (1000 запросов в день бесплатно)</li>
                <li>Введите ваш email адрес</li>
                <li>Нажмите "Submit" и проверьте почту</li>
                <li>Скопируйте ваш API ключ из письма или со страницы</li>
                <li>Откройте файл <code>src/App.jsx</code> и замените <code>'ваш_ключ_здесь'</code> на ваш ключ в строке 10</li>
                <li>Или создайте файл <code>.env</code> в корне проекта и добавьте: <code>VITE_OMDB_API_KEY=ваш_ключ</code></li>
              </ol>
              <p><strong>💡 Примечание:</strong> OMDb API работает лучше с английскими названиями фильмов</p>
            </div>
          )}
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
      )}

      {!loading && !error && movies.length === 0 && (
        <div className="movie-list-empty">
          <p>Введите название фильма в поле поиска и нажмите "Поиск"</p>
        </div>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  )
}

export default App
