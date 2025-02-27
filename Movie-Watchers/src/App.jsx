import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount, getTrendingMovies } from "./appWrite";

const BASE_API_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [trendingMovies, setTrendingMovies] = useState([]);
  //cosnt[(trendErrorMessage, setTrendErrorMessage)] = useState("");

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endPoint = query
        ? `${BASE_API_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${BASE_API_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endPoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies! 😶‍🌫️");
      }

      const data = await response.json();

      if (data.response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies! 😶‍🌫️");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error found in movies : ${error}`);
      setErrorMessage(`Error Fetching movies!😔 Try again later 😶‍🌫️`);
    } finally {
      setIsLoading(false);
    }
  };

  const fecthTrendingMovies = async () => {
    try {
      const trenMovies = await getTrendingMovies();

      setTrendingMovies(trenMovies);
    } catch (error) {
      console.error(`Error Fetching Trending Movies : ${error}`);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fecthTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header className="mt-0">
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> that will get
            your nervers.
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies🍿</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-600 text-3xl">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <p key={movie.id} className="text-white">
                  <MovieCard key={movie.id} movie={movie} />
                </p>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
