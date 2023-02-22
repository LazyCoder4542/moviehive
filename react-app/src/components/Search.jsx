import axios from "axios";
import React from "react";
import { useParams, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import * as Constant from './Constants'
import * as Function from './Functions'
async function getSearchResult(param) {
    const data = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
            api_key: Constant.accessToken,
            query: param
        }
    }).then((res)=> {
        return res;
    })
    return data.data;
}
function displaySearchResult(data) {
    return (
        {data}
    );
}
function SearchComp(props) {
    const { query } = useParams()
    const [searchResult, setSearchResult] = useState(null)
    const [filter, setFilter] = useState({
      genre: "any",
      release_date: "any"
    })
    const navigate = useNavigate()
    useEffect(() => {
        const data = getSearchResult(decodeURIComponent(query))
        data.then((res)=>{
            setSearchResult(res)
            console.log(res);
        })
      }, [query])
    const filterResults = () => {
      let val = filter
      let genreFilter = searchResult.results.filter((itm)=> {
        return val.genre !== "any" ? itm.genre_ids.includes(parseInt(val.genre) ) : true
      })
      if (val.release_date !== "any") {
        genreFilter = genreFilter.filter((itm)=> {
          return itm.release_date !== null
        })
        return genreFilter.sort((a, b)=> {
          if (val.release_date === "1") {
            return parseInt(b.release_date.split(" ")[0]) - parseInt(a.release_date.split(" ")[0])
          }
          return parseInt(a.release_date.split(" ")[0]) - parseInt(b.release_date.split(" ")[0])
        })
      }
      return genreFilter
    }
    return (
    <>
        <h1>Search results for { decodeURIComponent(query) }</h1>
        <div className="results flex flex-col gap-y-5">
          <div className="filters">
            <div className="genre">
              <label htmlFor="genre">Genre:</label>
              <select name="genre" id="genre" defaultValue="any"
              onChange={(e)=>{
                setFilter(previousData => {
                  return {
                    ...previousData,
                    genre: e.target.value
                  }
                })
              }}>
                <option value="any">Any</option>
                {props.genres.map((genre)=>{
                  return <option value={genre.id} key={genre.id}>{genre.name}</option>
                })}
              </select>
            </div>
            <div className="date">
              <label htmlFor="date">Date Released: </label>
              <select name="date" id="date" defaultValue="any" value={filter.release_date}
              onChange={(e)=>{
                setFilter(previousData => {
                  return {
                    ...previousData,
                    release_date: e.target.value
                  }
                })
              }}>
                <option value="any">Any</option>
                <option value="1">Newer First</option>
                <option value="0">Older First</option>
              </select>
            </div>
          </div>
          {(searchResult !== undefined & searchResult !== null) ? filterResults().map((itm, idx) => {
            return <li key={idx} className="flex flex-row list-none bg-gray-300 p-5 mx-10 rounded-xl gap-x-5"
            onClick={()=> {
              navigate(`/movie/${itm.id}`);
              }
            }
            >
              <img src={itm.poster_path ? Function.generateImageUrl(itm.poster_path) : "../video-icon.png"} alt={itm.title} className="w-1/6" />
              <div>
                <div className="text-lg">{itm.original_title}</div>
                <div className="">{itm.overview.charAt(0).toUpperCase() + itm.overview.slice(1)}</div>
                <div className="genre">{itm.genre_ids.map((itm)=> {
                  return <span key={itm}>{props.genres.find(g => g.id === itm).name}</span>
                })}</div>
                <div className="text-lg">{itm.popularity}</div>
                <div>released: {itm.release_date !== "" ? itm.release_date : "unknown"}</div>
              </div>
            </li>
          }) : ''}
      </div>
    </>
    );
}

export default SearchComp;

export {getSearchResult, displaySearchResult};