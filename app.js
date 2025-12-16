import Redis from 'ioredis';
import axios from 'axios';
const redis = new Redis({
    "port" : 6379,
    "host" : "127.0.0.1"
});


const cityEndpoint = (city)=>`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`;

const getWeather = async(city)=>{
    //check if we have cached calue of the city weather we want
    let cachedEntry = await redis.get(`weather:${city}`);


    //if we have a cached hit 
    if(cachedEntry){
        cachedEntry = JSON.parse(cachedEntry);
        //return that entry
        return {...cachedEntry,"source":"Cache"}

    }
    //we must have miss the cache
    //otherwise we are calling api for response 
    let apiRespone = await axios.get(cityEndpoint(city));
    redis.set(`weather:${city}`,JSON.stringify(apiRespone.data),'Ex',3600);


    return{...apiRespone.data,"source":"API"}
}

const city = 'Kathmandu';
const t0 = new Date().getTime();
let weather = await getWeather(city);   
const t1 = new Date().getTime();
weather.responseTime = `${t1-t0} ms`
console.log(weather);
process.exit(0);

