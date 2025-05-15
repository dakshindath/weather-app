import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WiDaySunny, WiCloudy, WiRain, WiThunderstorm, WiSnow, WiFog } from 'react-icons/wi';
import '../../styles/weather.css';

interface HourlyForecast {
  time: string;
  temperature: number;
  description: string;
}

interface TodayForecastProps {
  city: string;
}

const TodayForecast: React.FC<TodayForecastProps> = ({ city }) => {
  const [forecast, setForecast] = useState<HourlyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodayForecast(city);
  }, [city]);

  const fetchTodayForecast = async (cityName: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/weather/forecast?city=${cityName}`);
      
      const todayForecasts = res.data.forecast
        .filter((item: any) => {
          const itemDate = new Date(item.date).toISOString().split('T')[0];
          const today = new Date().toISOString().split('T')[0];
          return itemDate === today;
        })
        .map((item: any) => ({
          time: new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temperature: Math.round(item.temperature),
          description: item.description
        }))
        .slice(0, 8); 
      
      setForecast(todayForecasts);
      setLoading(false);
    } 
    catch (err: any) {
      setError(err.response?.data?.message || 'Could not fetch today\'s forecast');
      setLoading(false);
    }
  };

  const getWeatherIcon = (description: string) => {
    const desc = description?.toLowerCase() || '';
    if (desc.includes('clear')) return React.createElement(WiDaySunny as any, { size: 30, color: '#FFD700' });
    else if (desc.includes('cloud')) return React.createElement(WiCloudy as any, { size: 30, color: '#A9A9A9' });
    else if (desc.includes('rain')) return React.createElement(WiRain as any, { size: 30, color: '#4682B4' });
    else if (desc.includes('storm')) return React.createElement(WiThunderstorm as any, { size: 30, color: '#483D8B' });
    else if (desc.includes('snow')) return React.createElement(WiSnow as any, { size: 30, color: '#E0FFFF' });
    else if (desc.includes('mist') || desc.includes('fog')) return React.createElement(WiFog as any, { size: 30, color: '#D3D3D3' });
    return React.createElement(WiDaySunny as any, { size: 30, color: '#FFD700' });
  };

  return (
    <div className="today-forecast">
      <h2>Today's Forecast</h2>
      
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="weather-error">{error}</div>}
      
      <div className="hourly-forecast-container">
        {forecast.length > 0 ? (
          forecast.map((item, index) => (
            <div key={index} className="hourly-forecast-item">
              <div className="hourly-time">{item.time}</div>
              <div className="hourly-icon">{getWeatherIcon(item.description)}</div>
              <div className="hourly-temp">{item.temperature}°C</div>
            </div>
          ))
        ) : !loading && !error ? (
          <div className="no-forecast">No hourly forecast available</div>
        ) : null}
      </div>
    </div>
  );
};

export default TodayForecast;
