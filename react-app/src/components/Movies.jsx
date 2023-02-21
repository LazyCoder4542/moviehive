import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as Constant from './Constants'
import * as Function from './Functions'
async function getMovieInfo(id) {
    const data = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
        params: {
            api_key: Constant.accessToken,
        }
    }).then((res)=> {
        return res;
    })
    return data.data;
}
async function getImages(id) {
    const data = await axios.get(`https://api.themoviedb.org/3/movie/${id}/images`, {
        params: {
            api_key: Constant.accessToken,
        }
    }).then((res)=> {
        let imageURLs = res.data.backdrops.slice(0, 20).map(backdrop => {
            return Function.generateImageUrl(backdrop.file_path)
        })
        return imageURLs;
    })
    return data
}
async function getSimilarMovies(id) {
    const data = await axios.get(`https://api.themoviedb.org/3/movie/${id}/similar`, {
        params: {
            api_key: Constant.accessToken,
        }
    }).then((res)=> {
        return res
    })
    return data.data
}
function Movies() {
    const { movieId } = useParams()
    const [movieInfo, setMovieInfo] = useState(null)
    const [images, setImages] = useState(null)
    useEffect(()=>{
        getImages(movieId).then((res)=>{
            setImages(res)
        })
        getMovieInfo(movieId).then((res)=>{
            console.log(res);
            setMovieInfo(res)
        })
        getSimilarMovies(movieId).then((res)=>{
            console.log(res);
            //setMovieInfo(res)
        })
    }, [movieId])
    return (
    <>
        {movieInfo ? 
        <div className="relative pt-[20rem]">
            <picture className="absolute -z-10 top-0 overflow-hidden">
                <img src={movieInfo.backdrop_path ? Function.generateImageUrl(movieInfo.backdrop_path) : Function.generateImageUrl(movieInfo.poster_path)} className="w-full" alt="" />
            </picture>
            <div className="m-12 p-5 bg-slate-300 rounded-lg">
                <header className="flex flex-row gap-x-5">
                    <img src={Function.generateImageUrl(movieInfo.poster_path)} alt="" className="w-1/3" />
                    <div>
                        <div className="text-lg">{movieInfo.original_title}</div>
                        <div className="">{movieInfo.overview.charAt(0).toUpperCase() + movieInfo.overview.slice(1)}</div>
                        <div className="">{movieInfo.genres.map((genre)=> {
                        return <span key={genre.id}>{genre.name}</span>
                        })}</div>
                        <div className="text-lg">{movieInfo.popularity}</div>
                        <div>released: {movieInfo.release_date !== "" ? Function.stringifyDate(movieInfo.release_date) : "unknown"}</div>
                        <div>Runtime: {movieInfo.runtime !== "" ? Function.stringifyTime(movieInfo.runtime) : "unknown"}</div>
                    </div>
                </header>
                <section id="images">
                    <header>
                        <h1>
                            Images
                        </h1>
                    </header>
                    <div className="images flex flex-row gap-5 flex-wrap w-full justify-between">
                        {images.length !== 0 ? images.map((url, i)=>{
                            return <img src={url} alt={`img${i}`} key={i} className="w-40"/>
                          })
                          : <span className="p-10 m-auto">No Images to display</span>
                        }
                    </div>
                </section>
                <section id="similar-movies">
                    <header>
                        <h1>Similar Movies</h1>
                    </header>
                </section>
            </div>
        </div>
        : ""}
    </>);
}

export default Movies;