import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WiDaySunny, WiCloudy, WiRain, WiThunderstorm, WiSnow, WiFog, WiHumidity, WiStrongWind } from 'react-icons/wi';
import '../../styles/weather.css';

interface DailyForecast {
  day: string;
  temperature: number;
  description: string;
  windSpeed: number;
  humidity: number;
}

interface WeeklyForecastProps {
  city: string;
}

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ city }) => {
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeeklyForecast(city);
  }, [city]);

  const fetchWeeklyForecast = async (cityName: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/weather/forecast?city=${cityName}`);
     
      const processedForecasts: { [key: string]: DailyForecast } = {};
      
      res.data.forecast.forEach((item: any) => {
        const date = new Date(item.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dateKey = date.toISOString().split('T')[0]; 
        
        if (!processedForecasts[dateKey] || date.getHours() === 12) {
          processedForecasts[dateKey] = {
            day: dayName,
            temperature: item.temperature,
            description: item.description,
            windSpeed: item.windSpeed || 5,
            humidity: item.humidity || 50,
          };
        }
      });
      
      const forecastArray = Object.values(processedForecasts);
      setForecast(forecastArray);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not fetch weekly forecast');
      setLoading(false);
    }
  };

  const getWeatherIcon = (description: string) => {
    const desc = description?.toLowerCase() || '';
    if (desc.includes('clear')) return React.createElement(WiDaySunny as any, { size: 36, color: '#FFD700' });
    else if (desc.includes('cloud')) return React.createElement(WiCloudy as any, { size: 36, color: '#A9A9A9' });
    else if (desc.includes('rain')) return React.createElement(WiRain as any, { size: 36, color: '#4682B4' });
    else if (desc.includes('storm')) return React.createElement(WiThunderstorm as any, { size: 36, color: '#483D8B' });
    else if (desc.includes('snow')) return React.createElement(WiSnow as any, { size: 36, color: '#E0FFFF' });
    else if (desc.includes('mist') || desc.includes('fog')) return React.createElement(WiFog as any, { size: 36, color: '#D3D3D3' });
    return React.createElement(WiDaySunny as any, { size: 36, color: '#FFD700' });
  };

  return (
    <div className="weekly-forecast">
      <h2>Weekly Forecast</h2>
      
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="weather-error">{error}</div>}
      
      <div className="weekly-forecast-container">
        {forecast.length > 0 ? (
          forecast.map((item, index) => (
            <div key={index} className="weekly-forecast-item">
              <div className="day-name">{item.day}</div>
              <div className="weather-icon">{getWeatherIcon(item.description)}</div>
              <div className="day-temp">{Math.round(item.temperature)}°C</div>
              <div className="day-details">
                <div className="wind-speed">
                  {React.createElement(WiStrongWind as any, { size: 18, color: 'rgba(255, 255, 255, 0.75)' })}
                  <span>{item.windSpeed} m/s</span>
                </div>
                <div className="humidity">
                  {React.createElement(WiHumidity as any, { size: 18, color: 'rgba(255, 255, 255, 0.75)' })}
                  <span>{item.humidity}%</span>
                </div>
              </div>
            </div>
          ))
        ) : !loading && !error ? (
          <div className="no-forecast">No weekly forecast available</div>
        ) : null}
      </div>
    </div>
  );
};

export default WeeklyForecast;
