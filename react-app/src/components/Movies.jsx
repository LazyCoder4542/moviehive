import axios from "axios";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as Constant from './Constants'
import * as Function from './Functions'
import Swiper, { Navigation, Pagination } from 'swiper';
//import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
    const swiper = new Swiper(".swiper", {
        direction: 'horizontal',
        slidesPerView: 2,
        //loop: true,
        modules: [Navigation, Pagination],
        /*navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },*/
    });
    const { movieId } = useParams()
    const [movieInfo, setMovieInfo] = useState(null)
    const [similarMovies, setSimilarMovies] = useState(null)
    const [images, setImages] = useState(null)
    const navigate = useNavigate()
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
            if (res.results.length !== 0) {
                if (res.results.length > 10) {
                    setSimilarMovies(()=> {
                        return {
                            ...res,
                            results: res.results.slice(0, 10)
                        }
                    })
                }
                else {
                    setSimilarMovies(res)
                }
            }
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
                        <h2>
                            Images
                        </h2>
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
                        <h2>Similar Movies</h2>
                    </header>
                    <div className="swiper overflow-hidden">
                        <div className="swiper-wrapper flex flex-row flex-nowrap min-w-fit">
                            {
                                similarMovies ? similarMovies.results.map((itm, idx) => {
                                    return <li key={idx} className="swiper-slide flex flex-row list-none bg-gray-300 p-5 rounded-xl gap-x-5 h-52 w-[24rem]"
                                    onClick={()=> {
                                      navigate(`/movie/${itm.id}`);
                                      }
                                    }
                                    >
                                      <img src={itm.poster_path ? Function.generateImageUrl(itm.poster_path) : "../video-icon.png"} alt={itm.title} className="w-1/2 object-cover overflow-hidden object-center basis-full" />
                                      <div className="basis-full">
                                        <div className="text-lg">{itm.original_title}</div>
                                        <div className="text-lg">{itm.popularity}</div>
                                        <div>released: {itm.release_date !== "" ? itm.release_date : "unknown"}</div>
                                      </div>
                                    </li>}) : "Can't find any similar movies"
                            }
                        </div>
                        {/* <div class="swiper-button-prev"></div>
                        <div class="swiper-button-next"></div> */}
                    </div>
                </section>
            </div>
        </div>
        : ""}
    </>);
}

export default Movies;