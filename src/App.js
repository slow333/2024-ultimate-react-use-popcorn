import React, {useEffect, useState} from "react";
import StarRating from "./StarRating";

const KEY = "7c0d2be6"
export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null)
  const [watched, setWatched] = useState(() => {
    return JSON.parse(localStorage.getItem("watchedMovie"));
  });
  // const [watched, setWatched] = useState([]);

  const searchUrl = `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`

  function handleSelectedId(id) {
    setSelectedId(selectedId => selectedId === id ? null : id)
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie]);
    setSelectedId(null)
    // localStorage.setItem("watchedMovie", JSON.stringify(watched))
  }

  function handleDeleteWatchedMovie(id) {
    const filteredWatchedMovie = watched.filter(movie => movie.imdbID !== id)
    setWatched(filteredWatchedMovie)
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  useEffect(() => {
    localStorage.setItem("watchedMovie", JSON.stringify(watched))
  }, [watched]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError('');
        const res = await fetch(searchUrl,
             {signal: controller.signal});

        if (!res.ok) throw new Error("뭔가 이상합니다.");

        const data = await res.json();
        if (data.Response === "False") throw new Error("그런 영화는 없어요.");

        setMovies(data.Search);
        setError('');
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }

    handleCloseMovie();
    fetchMovies();

    return function () {
      controller.abort();
    }
  }, [query, searchUrl]);

  return (
       <>
         <NavBar>
           <Search onQuery={setQuery} query={query}/>
           <NumResults movies={movies}/>
         </NavBar>
         <Main>
           <Box>
             {isLoading && <Loader/>}
             {!isLoading && !error &&
                  <ListMovie values={movies} onSelectMovie={handleSelectedId}
                             handleCloseMovie={handleCloseMovie}/>}
             {error && <ErrorMessage message={error}/>}
           </Box>
           <Box>
             {selectedId
                  ? <MovieDetails
                       selectedId={selectedId}
                       onCloseMovie={handleCloseMovie}
                       onAddWatched={handleAddWatched}
                       watched={watched}
                  />
                  : <>
                    <WatchedMovieSummary watched={watched}/>
                    <ListWatched values={watched} onDeleteWatchedMovie={handleDeleteWatchedMovie}/>
                  </>
             }
           </Box>
         </Main>
       </>
  );
}

function Loader() {
  return (
       <ul className="list">
         <li>
           <div style={{width: "50px", height: "80px", gridRow: "1 / -1", border: "1px solid yellow"}}>image</div>
           <h3>제목</h3>
           <div>
             <p>
               <span>🗓</span>
               <span>2024년</span>
             </p>
           </div>
         </li>
       </ul>
  )
}

function ErrorMessage({message}) {
  return (
       <p className="error">
         <span>❌</span>{message}
       </p>
  )
}

function NavBar({children}) {
  return (
       <nav className="nav-bar">
         <Logo/>
         {children}
       </nav>
  )
}

function Logo() {
  return (
       <div className="logo">
         <span role="img">🍿</span>
         <h1>usePopcorn</h1>
       </div>
  )
}

function Search({query, onQuery}) {

  return (
       <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => onQuery(e.target.value)}
       />
  )
}

function NumResults({movies}) {
  return (
       <p className="num-results">
         Found <strong>{movies.length}</strong> results
       </p>
  )
}

function Main({children}) {
  return (
       <main className="main">
         {children}
       </main>
  )
}

function Box({children}) {
  const [isOpen, setIsOpen] = useState(true);
  return (
       <div className="box">
         <Button isOpen={isOpen} setIsOpen={setIsOpen}/>
         {isOpen && children}
       </div>
  )
}

function ListMovie({values, onSelectMovie}) {
  return (
       <ul className="list list-movies">
         {values?.map((value) => <Movie movie={value} key={value.imdbID} onSelectMovie={onSelectMovie}/>)}
       </ul>
  )
}

function Movie({movie, onSelectMovie}) {
  return (
       <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
         <img src={movie.Poster}
              alt={`${movie.Title.split(" ").at(0)} poster`}/>
         <h3>{movie.Title}</h3>
         <div>
           <p>
             <span>🗓</span>
             <span>{movie.Year}</span>
           </p>
         </div>
       </li>
  )
}

function ListWatched({values, onDeleteWatchedMovie}) {
  return (
       <ul className="list">
         {values?.map((value) =>
              <WatchedMovieDetail
                   movie={value} key={value.imdbID}
                   onDeleteWatchedMovie={onDeleteWatchedMovie}/>)}
       </ul>
  )
}

function MovieDetails({selectedId, onCloseMovie, onAddWatched, watched}) {
  const [movieDetails, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');
  const isWatched = watched.find(movie => movie.imdbID === selectedId);
  const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating;
  const searchUrl = `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`;

  const {
  Title: title, Year: year,
  Poster: poster, Runtime: runtime, imdbRating,
  Plot: plot, Released: released,
  Actors: actors, Director: director, Genre: genre, imdbID,
} = movieDetails;
  // eslint-disable
  // eslint-disable-next-line no-undef,react-hooks/rules-of-hooks
  // if(imdbRating > 6) [isTop, setIsTop] = useState(true);

  useEffect(() => {
    async function getMovieDetails() {
      try {
        setIsLoading(true);
        // setError('')
        const res = await fetch(searchUrl);
        const data = await res.json();
        setMovieDetails(data)
      } catch (e) {
        console.error(e.message)
        // setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }

    getMovieDetails();
  }, [selectedId, searchUrl]);

  useEffect(() => {
    document.title = `Movie | ${title}`
    return () => {
      document.title = "Back Home";
      console.log(`Clean up effect for movie title : ${title}`)
    }
  }, [movieDetails, title]);

  useEffect(() => {
    function callback(e) {
      if (e.code === 'Escape') {
        onCloseMovie();
        console.log("closing")
      }
    }
    document.addEventListener("keydown", callback)

    return function () {
      document.removeEventListener('keydown', callback)
    }
  }, [onCloseMovie]);

  function handleAdd() {
    const newMovie = {
      imdbID: imdbID, Title: title, Year: year, Poster: poster,
      runtime: Number(runtime.split(' ').at(0) || 0),
      imdbRating: Number(imdbRating), userRating
    }
    onAddWatched(newMovie);
  }

  return (
       <div className="details">
         {isLoading
              ? <Loader/>
              : <>
                <header>
                  <button onClick={onCloseMovie} className="btn-back">&larr;</button>
                  <img src={poster} alt={`poster of ${title}`}/>
                  <div className="details-overview">
                    <h2>{title}</h2>
                    <p>{released} &bull; {runtime}</p>
                    <p>{genre}</p>
                    <p><span>⭐</span>{imdbRating} IMDb rating</p>
                  </div>
                </header>
                <section>
                  <div className="rating">
                    {isWatched ? <p>이미 봤어요. rating : {watchedUserRating}</p> : <>
                      <StarRating maxRating={10} fullColor="yellow" size={24} key={selectedId}
                                  onSetRating={setUserRating}/>
                      {userRating > 0 &&
                           <button className="btn-add" onClick={handleAdd}>+ Add movie</button>}
                    </>}

                  </div>
                  <p><em>{plot}</em></p>
                  <p>Starring {actors}</p>
                  <p>Directed by {director}</p>
                </section>
              </>}
       </div>
  )
}

function WatchedMovieSummary({watched}) {
  const average = (arr) =>
       arr.reduce((acc, cur, idx, arr) => (acc + cur) / arr.length, 0);

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
       <div className="summary">
         <h2>Movies you watched</h2>
         <div>
           <p>
             <span>#️⃣</span>
             <span>{watched.length} movies</span>
           </p>
           <p>
             <span>⭐️</span>
             <span>{avgImdbRating.toFixed(2)}</span>
           </p>
           <p>
             <span>🌟</span>
             <span>{avgUserRating.toFixed(2)}</span>
           </p>
           <p>
             <span>⏳</span>
             <span>{avgRuntime.toFixed(1)} min</span>
           </p>
         </div>
       </div>
  )
}

function WatchedMovieDetail({movie, onDeleteWatchedMovie}) {
  return (
       <li>
         <img src={movie.Poster} alt={`${movie.Title} poster`}/>
         <h3>{movie.Title}</h3>
         <div>
           <p>
             <span>⭐️</span>
             <span>{movie.imdbRating}</span>
           </p>
           <p>
             <span>🌟</span>
             <span>{movie.userRating}</span>
           </p>
           <p>
             <span>⏳</span>
             <span>{movie.runtime} min</span>
           </p>
           <button className="btn-delete" onClick={() => onDeleteWatchedMovie(movie.imdbID)}>X</button>
         </div>
       </li>
  )
}

function Button({isOpen, setIsOpen}) {
  return (
       <button
            className="btn-toggle"
            onClick={() => setIsOpen((open) => !open)}>
         {isOpen ? "-" : "+"}
       </button>
  )
}