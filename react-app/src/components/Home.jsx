import axios from "axios";
import React from "react";
import { useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import * as Constant from './Constants'
import * as Function from './Functions'
import Swiper, { Navigation, Pagination } from 'swiper';
//import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
function Home(props) {
    const [data, setData] = useState({
        trending: null,
        popular: null,
        top_rated: null,
    })
    useEffect(()=> {
        // trending movies this week
        axios.get("https://api.themoviedb.org/3/trending/movie/week", {
            params: {
                api_key: Constant.accessToken
            }
        }).then((res)=> {
            setData(prevData=> {
                return {
                    ...prevData,
                    trending: res.data
                }
            })
        })
        // popular movies
        axios.get("https://api.themoviedb.org/3/movie/popular", {
            params: {
                api_key: Constant.accessToken
            }
        }).then((res)=> {
            setData(prevData=> {
                return {
                    ...prevData,
                    popular: res.data
                }
            })
        })
        // top-rated movies
        axios.get("https://api.themoviedb.org/3/movie/top_rated", {
            params: {
                api_key: Constant.accessToken
            }
        }).then((res)=> {
            setData(prevData=> {
                return {
                    ...prevData,
                    top_rated: res.data
                }
            })
        })
        setTimeout(()=> {
            new Swiper(".swiper", {
                direction: 'horizontal',
                slidesPerView: 2,
                //loop: true,
                modules: [Navigation, Pagination],
                breakpoints: {
                    480: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                    640: {
                      slidesPerView: 4,
                      spaceBetween: 30,
                    },
                    1000: {
                        slidesPerView: 5,
                        spaceBetween: 40,
                      },
                }
            });
        }, 5000)
    })
    const navigate = useNavigate()
    return (
    <>
        <section id="trending-movies">
            <header>
                <h2>Trending Movies <small>this week</small></h2>
            </header>
            <div className="swiper overflow-hidden">
            <div className="swiper-wrapper flex flex-row flex-nowrap min-w-fit">
                {(data.trending !== null) ? data.trending.results.map((itm, idx) => {
                return <li key={idx} className="swiper-slide overflow-hidden flex flex-row list-none bg-gray-300 rounded-xl h-[15rem] w-[24rem]"
                onClick={()=> {
                  navigate(`/movie/${itm.id}`);
                  }
                }
                >
                  <img src={itm.poster_path ? Function.generateImageUrl(itm.poster_path, "w200") : "../video-icon.png"} alt={itm.title} className="w-1/2 object-cover overflow-hidden object-center basis-full" />
                  <div className="basis-full p-2 grid grid-rows-3 grid-flow-col">
                    <div className="text-lg title">{itm.original_title}</div>
                    <div className="genre mb-auto">{ props.genres ? itm.genre_ids.map((itm)=> {
                      return <span key={itm}>{props.genres.find(g => {
                        return g.id === itm
                    }).name}</span>
                    }) : ""}</div>
                    <div className="text-lg mt-auto">{itm.popularity}</div>
                  </div>
                </li>
                          }) : ''}
            </div>
            </div>
        </section>
        <section id="trending-movies">
            <header>
                <h2>Popular Movies</h2>
            </header>
            <div className="swiper overflow-hidden">
            <div className="swiper-wrapper flex flex-row flex-nowrap min-w-fit">
                {(data.popular !== null) ? data.popular.results.map((itm, idx) => {
                return <li key={idx} className="swiper-slide overflow-hidden flex flex-row list-none bg-gray-300 rounded-xl h-[15rem] w-[24rem]"
                onClick={()=> {
                  navigate(`/movie/${itm.id}`);
                  }
                }
                >
                  <img src={itm.poster_path ? Function.generateImageUrl(itm.poster_path, "w200") : "../video-icon.png"} alt={itm.title} className="w-1/2 object-cover overflow-hidden object-center basis-full" />
                  <div className="basis-full p-2 grid grid-rows-3 grid-flow-col">
                    <div className="text-lg title">{itm.original_title}</div>
                    <div className="genre mb-auto">{ props.genres ? itm.genre_ids.map((itm)=> {
                      return <span key={itm}>{props.genres.find(g => {
                        return g.id === itm
                    }).name}</span>
                    }) : ""}</div>
                    <div className="text-lg mt-auto">{itm.popularity}</div>
                  </div>
                </li>
                          }) : ''}
            </div>
            </div>
        </section>
        <section id="top-rated-movies">
            <header>
                <h2>Top-rated Movies</h2>
            </header>
            <div className="swiper overflow-hidden">
            <div className="swiper-wrapper flex flex-row flex-nowrap min-w-fit">
                {(data.top_rated !== null) ? data.top_rated.results.map((itm, idx) => {
                return <li key={idx} className="swiper-slide overflow-hidden flex flex-row list-none bg-gray-300 rounded-xl h-[15rem] w-[24rem]"
                onClick={()=> {
                  navigate(`/movie/${itm.id}`);
                  }
                }
                >
                  <img src={itm.poster_path ? Function.generateImageUrl(itm.poster_path, "w200") : "../video-icon.png"} alt={itm.title} className="w-1/2 object-cover overflow-hidden object-center basis-full" />
                  <div className="basis-full p-2 grid grid-rows-3 grid-flow-col">
                    <div className="text-lg title">{itm.original_title}</div>
                    <div className="genre mb-auto">{ props.genres ? itm.genre_ids.map((itm)=> {
                      return <span key={itm}>{props.genres.find(g => {
                        return g.id === itm
                    }).name}</span>
                    }) : ""}</div>
                    <div className="text-lg mt-auto">{itm.popularity}</div>
                  </div>
                </li>
                          }) : ''}
            </div>
            </div>
        </section>
    </> );
}
export default Home;