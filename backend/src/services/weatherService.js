const axios = require('axios');

const fetchCurrentWeather = async (city)=>{
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
    try{
        const response = await axios.get(url);
        const data = response.data;

        return{
            city: data.name,
            temperature: data.main.temp,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            clouds: data.clouds?.all || 0,
            feels_like: data.main.feels_like,
            country: data.sys.country
        };
    }
    catch(error){
        throw new Error(error.response?.data?.message || "error fetching data");
    }
}; 

const fetchWeatherForecast = async (city)=>{
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
    try{
        const response = await axios.get(url);
        const data = response.data;
        const forecast = data.list.map((item)=>({
            date: item.dt_txt,
            temperature: item.main.temp,
            description: item.weather[0].description,
            humidity: item.main.humidity,
            windSpeed: item.wind.speed,
            clouds: item.clouds?.all || 0
        }));

        return{
            city: data.city.name, 
            country: data.city.country,
            forecast
        };
    }
    catch(error){
        throw new Error(error.response?.data?.message || "error fetching data");
    }
};

module.exports = { fetchCurrentWeather, fetchWeatherForecast};