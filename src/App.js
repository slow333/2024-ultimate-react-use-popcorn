import React, {useEffect, useState} from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
         "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
         "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
         "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
         "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
         "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
     arr.reduce((acc, cur, idx, arr) => acc + cur / arr.length, 0);

const KEY = "7c0d2be6"
export default function App() {
  const [query, setQuery] = useState("war");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null)

  const searchUrl = `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`

  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError('')
        const res = await fetch(searchUrl);

        if (!res.ok) throw new Error("뭔가 이상합니다.");

        const data = await res.json();
        if (data.Response === "False") throw new Error("그런 영화는 없어요.");

        setMovies(data.Search)
      } catch (e) {
        console.error(e.message)
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }
    fetchMovies();
  }, [query, searchUrl]);

  function handleCloseSelectedMovie() {
    setSelectedId(null)
  }

  function handleSelectedId(id) {
    setSelectedId(selectedId => selectedId === id ? null : id)
  }

  function handleAddWatched(movie) {
     setWatched(watched => [...watched, movie])
    setSelectedId(null)
  }

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
                             handleCloseMovie={handleCloseSelectedMovie}/>}
             {error && <ErrorMessage message={error}/>}
           </Box>
           <Box>
             {selectedId
                  ? <SelectedMovie
                       selectedId={selectedId}
                       onCloseMovie={handleCloseSelectedMovie}
                       onAddWatched={handleAddWatched}
                       watched={watched}
                  />
                  : <>
                    <WatchedMovieSummary watched={watched}/>
                    <ListWatched values={watched}/>
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
         <img src={movie.Poster} alt={`${movie.Title} poster`}/>
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

function ListWatched({values}) {
  return (
       <ul className="list">
         {values?.map((value) => <WatchedMovieDetail movie={value} key={value.imdbID}/>)}
       </ul>
  )
}

function SelectedMovie({selectedId, onCloseMovie, onAddWatched, watched}) {
  const [movieDetails, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');
  const isWatched = watched.find(movie => movie.imdbID === selectedId);
  const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating;
  const searchUrl = `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
  const {
    Title: title, Year: year,
    Poster: poster, Runtime: runtime, imdbRating, Plot: plot, Released: released,
    Actors: actors, Director: director, Genre: genre, imdbID,
  } = movieDetails;

  useEffect(() => {
    async function getMovieDetails() {
      try {
        setIsLoading(true);
        // setError('')
        const res = await fetch(searchUrl);

        if (!res.ok) throw new Error("뭔가 이상합니다.");

        const data = await res.json();
        if (data.Response === "False") throw new Error("그런 영화는 없어요.");
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
                    </> }

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
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating)).toFixed(2);
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
             <span>{avgImdbRating}</span>
           </p>
           <p>
             <span>🌟</span>
             <span>{avgUserRating}</span>
           </p>
           <p>
             <span>⏳</span>
             <span>{avgRuntime} min</span>
           </p>
         </div>
       </div>
  )
}

function WatchedMovieDetail({movie}) {
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