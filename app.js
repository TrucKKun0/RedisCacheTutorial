import Redis from 'ioredis';
import axios from 'axios';
const redis = new Redis({
    "port" : 6379,
    "host" : "127.0.0.1"
});

const DEFAULT_EXPIRATION = 3600;

const cityEndpoint = (city)=>`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`;

// const getWeather = async(city)=>{
//     //check if we have cached calue of the city weather we want
//     //let cachedEntry = await redis.get(`weather:${city}`);


//     //if we have a cached hit 
//     // if(cachedEntry){
//     //     cachedEntry = JSON.parse(cachedEntry);
//     //     //return that entry
//     //     return {...cachedEntry,"source":"Cache"}

//     // }
//     //we must have miss the cache
//     //otherwise we are calling api for response 
//    // redis.set(`weather:${city}`,JSON.stringify(apiRespone.data),'Ex',3600);

//    const result = await getOrSetCache(`weather:${city}`,async ()=>{
//     const response = await axios.get(cityEndpoint(city));   
//     return response.data;
//    })


//     return{...result.data,source:result.source}
// }
const getWeather = async (city) => {
    const result = await getOrSetCache(
        `weather:${city.toLowerCase()}`,
        async () => {
            const response = await axios.get(cityEndpoint(city));
            return response.data;
        }
    );

    return {
        ...result.data,
        source: result.source
    };
};

async function getOrSetCache(key,cb){
    const cachedData = await redis.get(key);
    if(cachedData){
        return {
            data:JSON.parse(cachedData),
            source:"Cache"
        }
    }
    const freshData = await cb();
    await redis.setex(key,DEFAULT_EXPIRATION,JSON.stringify(freshData));
    return {
        data:freshData,
        source:"API"
    }
}


const city = 'Imadol';
const t0 = new Date().getTime();
let weather = await getWeather(city);   
const t1 = new Date().getTime();
weather.responseTime = `${t1-t0} ms`
console.log(weather);
process.exit(0);

