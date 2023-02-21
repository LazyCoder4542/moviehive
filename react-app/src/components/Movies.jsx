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
        let imageURLs = res.data.backdrops.map(backdrop => {
            return Function.generateImageUrl(backdrop.file_path)
        })
        console.log(imageURLs);
        return imageURLs;
    })
    return data
}
function Movies() {
    const { movieId } = useParams()
    const [movieInfo, setMovieInfo] = useState(null)
    const [images, setImages] = useState(null)
    useEffect(()=>{
        getImages(movieId).then((res)=>{
            console.log(res);
            setImages(res)
        })
        getMovieInfo(movieId).then((res)=>{
            console.log(res);
            setMovieInfo(res)
        })
    }, [movieId])
    return (
    <>
        {movieInfo ? 
        <div className="relative pt-[20rem]">
            <picture className="absolute -z-10 top-0">
                <img src={movieInfo.backdrop_path !== "" ? Function.generateImageUrl(movieInfo.backdrop_path) : Function.generateImageUrl(movieInfo.poster_path)} className="w-full" alt="" />
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
                    </div>
                </header>
                <section id="images">
                    <header>
                        <h1>
                            Images
                        </h1>
                    </header>
                    <div className="images flex flex-row gap-x-5">
                        {images ? images.map((url, i)=>{
                            return <img src={url} alt={`img${i}`} key={i} className="w-40"/>
                          })
                          : ""
                        }
                    </div>
                </section>
            </div>
            {JSON.stringify(movieInfo)}
        </div>
        : ""}
    </>);
}

export default Movies;