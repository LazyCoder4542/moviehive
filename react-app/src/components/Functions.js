import axios from "axios"
import { accessToken } from "./Constants"
export const generateImageUrl = (path, type="original") => {
    return `https://image.tmdb.org/t/p/${type}/${path}`
}
export async function generateGenres() {
    axios.get("https://api.themoviedb.org/3/genre/movie/list", {
        params: {
            api_key: accessToken
        }
    })
    .then((res)=> {
        //console.log(res.data);
        return res.data;
    })
}
export function stringifyDate(string) {
    let arr =  string.split("-");
    const event = new Date()
    event.setFullYear(parseInt(arr[0]))
    event.setMonth(parseInt(arr[1]))
    event.setDate(parseInt(arr[2]))
    return event.toUTCString().split(" ").slice(1, 4).join(" ")
}