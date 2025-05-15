import React, { useEffect, useState, useRef } from 'react';
import '../../styles/home.css';
import CurrentWeather from '../weather/currentWeather';
import WeeklyForecast from '../weather/weeklyForecast';
import TodayForecast from '../weather/todayForecast';

const Home: React.FC = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [city, setCity] = useState('Kerala'); 
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
    const updateDateTime = () => {
        const now = new Date();
       
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        
        setCurrentDate(`${formattedDate} ${hours}:${minutes} IST`);
    };
    
    updateDateTime();
    const timer = setInterval(updateDateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (searchInput.length >= 2) {
      const mockCities = [
        'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur',
        'Lucknow', 'Surat', 'Nagpur', 'Visakhapatnam', 'Indore',
        'Mumbai', 'Delhi', 'Kerala', 'Chennai', 'Kolkata',
        'Trivandrum', 'kollam','Kochi', 'Malappuram', 'Thrissur', 'Palakkad', 'Kozhikode',
        'Kannur', 'Wayanad', 'Idukki', 'Alappuzha', 'Pathanamthitta',
        'Kottayam', 'Ernakulam', 'Kasargod', 'Munnar',
      ];
      
      const filtered = mockCities.filter(c => 
        c.toLowerCase().includes(searchInput.toLowerCase())
      );
      
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchInput]);

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setSearchInput(selectedCity);
    setSuggestions([]);
    setIsInputFocused(false);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSuggestions([]);
        setIsInputFocused(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="weather-app">
      <header className="weather-header">
        <h1>The Weather Forecasting</h1>
        <div className="current-date">{currentDate}</div>
      </header>
      <div className="global-search-container">
        <div className="global-search-bar" ref={searchRef}>
          <input  type="text"  value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onFocus={() => setIsInputFocused(true)} placeholder="Search for a city" className="global-search-input" />
          {suggestions.length > 0 && isInputFocused && (
            <ul className="global-search-suggestions">
              {suggestions.map((suggestion, index) => (
                <li  key={index}  onClick={() => { 
                    handleCitySelect(suggestion); 
                    setIsInputFocused(false);
                  }} >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="grid-layout">
        <div className="current-weather-container">
          <CurrentWeather city={city} />
        </div>
        <div className="today-forecast-container">
          <TodayForecast city={city} />
        </div>
        <div className="weekly-forecast-container">
          <WeeklyForecast city={city} />
        </div>
      </div>
    </div>
  );
};

export default Home;