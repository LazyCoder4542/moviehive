import React from 'react';
import { useState, useEffect } from 'react';
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
      <header className="App-header flex content-center justify-between py-5" id='site-header'>
        <h1><Link to={"/"} style={{all: 'unset !important'}}>MoviHive</Link></h1>
        <div className="search flex flex-row bg-slate-600 content-center p-2 rounded-md">
          <input
          type="text"
          value={search}
          placeholder="search movies..."
          className="rounded-md p-4 outline-0"
          onChange={(e)=>{
            setSearch(e.target.value)
          }}/>
          <button
          className="inline-flex m-auto py-4 px-10 outline-0"
          onClick={handleSearch}>search</button>
        </div>
      </header>
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
