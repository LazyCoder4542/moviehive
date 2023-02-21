import React from 'react';
import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import SearchComp from './components/Search';
import Movies from './components/Movies';
import * as Constant from './components/Constants'
import axios from 'axios';

function App() {
  const [search, setSearch] = useState('')
  const [genres, setGenres] = useState([])
  const navigate = useNavigate()
  const handleSearch = () => {
    navigate(`/search/${encodeURIComponent(search)}`);
  }
  useEffect(() => {
    axios.get("https://api.themoviedb.org/3/genre/movie/list", {
        params: {
            api_key: Constant.accessToken
        }
    })
    .then((res)=> {
      setGenres(res.data.genres)
    })
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <h1>MoviHive</h1>
      </header>
      <div className="search">
        <input
        type="text"
        value={search}
        onChange={(e)=>{
          setSearch(e.target.value)
        }}/>
        <button
        onClick={handleSearch}>search</button>
      </div>
      <div className="container min-w-full">
        <Routes>
          <Route exact path="/" element={<>Home</>}/>
          <Route exact path="/home" element={<>Home</>}/>
          <Route exact path="search/:query" element={<SearchComp genres={genres}/>}/>
          <Route exact path="movie/:movieId" element={<Movies/>}/>
          <Route path="*" element={<>NotFound</>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
