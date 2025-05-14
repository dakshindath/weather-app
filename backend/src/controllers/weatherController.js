const { fetchCurrentWeather, fetchWeatherForecast } = require("../services/weatherService");

const getCurrentWeather = async (req, res)=>{
    const { city } = req.query;
    if(!city){
        return res.status(400).json({ message: "city is required"});
    }
    try{
        const weatherData = await fetchCurrentWeather(city);
        res.json(weatherData);
    }
    catch(error){
        res.status(500).json({ message: error.message});
    }
};

const getWeatherForecast = async (req, res)=>{
    const {city} = req.query;
    if(!city){
        return res.status(400).json({message: "city is required"});
    }
    try{
        const forecastData = await fetchWeatherForecast(city);
        res.json(forecastData);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

module.exports = { getCurrentWeather, getWeatherForecast };