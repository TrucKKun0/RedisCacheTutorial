# Redis Caching Tutorial

A Node.js project demonstrating how to implement Redis caching for API calls using the OpenWeatherMap API.

## Overview

This tutorial shows how to use Redis as a caching layer to improve performance and reduce API calls. The application fetches weather data for a city and caches the results for 1 hour.

## Features

- ✅ Redis caching with automatic expiration
- ✅ Weather data from OpenWeatherMap API
- ✅ Cache hit/miss tracking
- ✅ Response time measurement
- ✅ Automatic fallback to API on cache miss

## Prerequisites

- Node.js (v14 or higher)
- Redis server running locally
- OpenWeatherMap API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd redis-tutorial
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
WEATHER_API_KEY=your_openweathermap_api_key_here
```

## Redis Setup

Make sure Redis is installed and running on your local machine:

```bash
# Start Redis server (default port 6379)
redis-server
```

## Usage

Run the application:
```bash
node app.js
```

The application will:
1. Check Redis cache for weather data
2. If cached, return data from cache (marked as `"source":"Cache"`)
3. If not cached, fetch from OpenWeatherMap API (marked as `"source":"API"`)
4. Cache the API response for 1 hour (3600 seconds)
5. Display response time in milliseconds

## How It Works

### Cache Flow

```
Request → Check Redis Cache
    ↓
Cache Hit? 
    ├─ Yes → Return cached data (fast)
    └─ No  → Call API → Cache result → Return data
```

### Code Example

<augment_code_snippet path="app.js" mode="EXCERPT">
````javascript
const getWeather = async(city)=>{
    let cachedEntry = await redis.get(`weather:${city}`);
    if(cachedEntry){
        return {...JSON.parse(cachedEntry),"source":"Cache"}
    }
    let apiRespone = await axios.get(cityEndpoint(city));
    redis.set(`weather:${city}`,JSON.stringify(apiRespone.data),'Ex',3600);
    return{...apiRespone.data,"source":"API"}
}
````
</augment_code_snippet>

## Configuration

- **Redis Host**: `127.0.0.1`
- **Redis Port**: `6379`
- **Cache Expiration**: `3600 seconds` (1 hour)
- **Default City**: `Kathmandu` (can be changed in `app.js`)

## Dependencies

- **ioredis** (^5.8.2) - Redis client for Node.js
- **axios** (^1.13.2) - HTTP client for API requests
- **dotenv** (^17.2.3) - Environment variable management

## Example Output

First run (cache miss):
```json
{
  "coord": {...},
  "weather": [...],
  "main": {...},
  "source": "API",
  "responseTime": "450 ms"
}
```

Second run (cache hit):
```json
{
  "coord": {...},
  "weather": [...],
  "main": {...},
  "source": "Cache",
  "responseTime": "15 ms"
}
```

## Learning Points

- Redis caching significantly reduces response times
- Cache expiration prevents stale data
- Key naming convention: `weather:${city}`
- JSON serialization for complex data structures

## License

ISC

