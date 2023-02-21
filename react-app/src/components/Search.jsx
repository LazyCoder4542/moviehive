import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as Constant from './Constants'
import * as Function from './Functions'
async function getSearchResult(param) {
    console.log(param);
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
    useEffect(() => {
        const data = getSearchResult(decodeURIComponent(query))
        data.then((res)=>{
            setSearchResult(res)
            console.log(res);
        })
      }, [query])
    return (
    <>
        <h1>Search results for { decodeURIComponent(query) }</h1>
        <div className="results flex flex-col gap-y-5">
        {(searchResult !== undefined & searchResult !== null) ? searchResult.results.map((itm, idx) => {
          return <li key={idx} className="flex flex-row list-none bg-gray-300 p-5 mx-10 rounded-xl gap-x-5">
            <img src={itm.poster_path ? Function.generateImageUrl(itm.poster_path) : "../video-icon.png"} alt={itm.title} className="w-1/6" />
            <div>
              <div className="text-lg">{itm.original_title}</div>
              <div className="">{itm.overview.charAt(0).toUpperCase() + itm.overview.slice(1)}</div>
              <div className="">{itm.genre_ids.map((itm)=> {
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