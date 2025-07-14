import css from'./App.module.css'
import { useState } from 'react'
import toast from "react-hot-toast";
import { Toaster } from 'react-hot-toast';

import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar'
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';


export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  

  const handleSearch = async (searchQuery: string) => {
    try {
      setIsError(false);
      setMovies([]);
      setIsLoading(true);

      const findMovies = await fetchMovies(searchQuery);
      if (findMovies.length === 0) {
        toast("No movies found for your request.", {
          duration: 3000,
          position: "top-center"
        });
      }
      setMovies(findMovies);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectedMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  
  const closeModal = () => setSelectedMovie(null);


  return (
    <div className={css.app}>
      
      <SearchBar onSubmit={handleSearch} />
      <Toaster />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      
      {movies.length > 0 && (
        <MovieGrid onSelect={handleSelectedMovie} movies={movies} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}

    </div>
  );
};


