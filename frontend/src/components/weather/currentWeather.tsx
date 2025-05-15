import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { WiDaySunny, WiCloudy, WiRain, WiThunderstorm, WiSnow, WiFog, WiDayCloudy, WiStrongWind, WiHumidity, WiThermometer, WiCloud } from 'react-icons/wi';
import '../../styles/weather.css';

interface CurrentWeatherProps {
  city: string;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ city }) => {
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch weather when city prop changes
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/weather/current?city=${cityName}`);
      setWeather(res.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not fetch weather');
      setLoading(false);
    }
  };

  const getWeatherIcon = (description: string) => {
    const desc = description?.toLowerCase() || '';
    let IconComponent: any = WiDayCloudy;
    
    if (desc.includes('clear')) IconComponent = WiDaySunny;
    else if (desc.includes('cloud')) IconComponent = WiCloudy;
    else if (desc.includes('rain')) IconComponent = WiRain;
    else if (desc.includes('storm')) IconComponent = WiThunderstorm;
    else if (desc.includes('snow')) IconComponent = WiSnow;
    else if (desc.includes('mist') || desc.includes('fog')) IconComponent = WiFog;
    
    return React.createElement(IconComponent, { size: 70, color: '#FFD700' });
  };

  return (
    <div className="weather-section">
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="weather-error">{error}</div>}
      
      {weather && (
        <div className="weather-content">
          <div className="current-weather">
            <div className="location-temp">
              <h2 className="location">{weather.city}, {weather.country || 'IN'}</h2>
              <div className="temperature-container">
                <div className="temperature">{Math.round(weather.temperature)}°C</div>
                <div className="weather-icon-main">{getWeatherIcon(weather.description)}</div>
              </div>
              <div className="description">{weather.description}</div>
            </div>
            
            <div className="air-conditions">
              <h3>Air Conditions</h3>
              <div className="conditions-grid">
                <div className="condition-item">
                  {React.createElement(WiThermometer as any, { size: 22, color: '#A9A9A9' })}
                  <div>
                    <span className="condition-label">Real Feel</span>
                    <span className="condition-value">{Math.round(weather.feels_like || (weather.temperature - 1))}°C</span>
                  </div>
                </div>
                
                <div className="condition-item">
                  {React.createElement(WiStrongWind as any, { size: 22, color: '#A9A9A9' })}
                  <div>
                    <span className="condition-label">Wind</span>
                    <span className="condition-value">{weather.windSpeed} m/s</span>
                  </div>
                </div>
                
                <div className="condition-item">
                  {React.createElement(WiCloud as any, { size: 22, color: '#A9A9A9' })}
                  <div>
                    <span className="condition-label">Clouds</span>
                    <span className="condition-value">{weather.clouds || '0'}%</span>
                  </div>
                </div>
                
                <div className="condition-item">
                  {React.createElement(WiHumidity as any, { size: 22, color: '#A9A9A9' })}
                  <div>
                    <span className="condition-label">Humidity</span>
                    <span className="condition-value">{weather.humidity}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentWeather;