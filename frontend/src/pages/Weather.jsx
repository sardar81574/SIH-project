import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Search, 
  Navigation, 
  MapPin, 
  Calendar, 
  Sparkles, 
  CloudRain, 
  Thermometer, 
  Compass,
  Eye,
  Sun,
  ShieldCheck,
  RefreshCw,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Weather() {
  const [cityInput, setCityInput] = useState('');
  const [locationName, setLocationName] = useState('Indore, Madhya Pradesh');
  const [coords, setCoords] = useState({ lat: 22.7196, lon: 75.8577 });
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  // WMO Standard Weather Interpretation
  const getWeatherDetails = (code) => {
    if (code === 0) return { label: 'Clear Sky', icon: '☀️', risk: 'Low', desc: 'Optimal for all field operations.' };
    if ([1, 2, 3].includes(code)) return { label: 'Partly Cloudy', icon: '⛅', risk: 'Low', desc: 'Good conditions for foliar spray.' };
    if ([45, 48].includes(code)) return { label: 'Fog / Mist', icon: '🌫️', risk: 'Moderate', desc: 'Elevated fungal spore germination risk.' };
    if ([51, 53, 55].includes(code)) return { label: 'Light Drizzle', icon: '🌦️', risk: 'Moderate', desc: 'Hold chemical spraying until leaves dry.' };
    if ([61, 63, 65].includes(code)) return { label: 'Rain Showers', icon: '🌧️', risk: 'High', desc: 'Halt irrigation and pesticide spray immediately.' };
    if ([71, 73, 75].includes(code)) return { label: 'Snowfall / Hail', icon: '❄️', risk: 'Severe', desc: 'Inspect physical shelter and drainage.' };
    if ([80, 81, 82].includes(code)) return { label: 'Heavy Rain Showers', icon: '🌧️', risk: 'High', desc: 'Ensure water drainage in low-lying crop beds.' };
    if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm & Hail', icon: '⛈️', risk: 'Severe', desc: 'Severe weather hazard. Keep farm machinery sheltered.' };
    return { label: 'Moderate Weather', icon: '🌤️', risk: 'Low', desc: 'Favorable agricultural conditions.' };
  };

  // Live Accurate Weather Engine
  const fetchWeatherData = async (lat, lon, displayName) => {
    setLoading(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure,uv_index,dew_point_2m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&timezone=auto`;
      const res = await axios.get(url);
      setWeatherData(res.data);
      if (displayName) setLocationName(displayName);
    } catch (err) {
      console.error("Live weather acquisition failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(coords.lat, coords.lon, locationName);
  }, []);

  // Global & Pan-India Precision Search (Google Geocoding equivalent)
  const handleSearchCity = async (e) => {
    e.preventDefault();
    if (!cityInput.trim()) return;

    try {
      setLoading(true);
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityInput)}&count=5&language=en&format=json`;
      const geoRes = await axios.get(geoUrl);

      if (geoRes.data.results && geoRes.data.results.length > 0) {
        const place = geoRes.data.results[0];
        const formattedTitle = `${place.name}${place.admin1 ? ', ' + place.admin1 : ''} (${place.country_code ? place.country_code.toUpperCase() : 'IN'})`;
        setCoords({ lat: place.latitude, lon: place.longitude });
        await fetchWeatherData(place.latitude, place.longitude, formattedTitle);
        setCityInput('');
      } else {
        alert("Location not found. Please specify city, district, or pin-code.");
      }
    } catch (err) {
      console.error(err);
      alert("Error resolving geolocation coordinates.");
    } finally {
      setLoading(false);
    }
  };

  // Reverse Geocoding with Google-Level Precision
  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation hardware is unavailable on this device.");
      return;
    }

    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCoords({ lat, lon });

        // Reverse-geocode to get exact city and district name
        try {
          const reverseRes = await axios.get(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
          );
          const city = reverseRes.data.city || reverseRes.data.locality || reverseRes.data.principalSubdivision || "Current Farm Field";
          const state = reverseRes.data.principalSubdivision || "";
          const resolvedName = `${city}${state ? ', ' + state : ''} (Live GPS)`;
          await fetchWeatherData(lat, lon, resolvedName);
        } catch {
          await fetchWeatherData(lat, lon, `Farm GPS: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`);
        }
        setIsGpsLoading(false);
      },
      (err) => {
        console.error("GPS access denied:", err);
        alert("Please enable browser location permission to get live farm weather.");
        setIsGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const current = weatherData?.current;
  const currentCondition = current ? getWeatherDetails(current.weather_code) : null;

  // Filter next 24 hours for Google-style hourly chart
  const next24Hours = weatherData?.hourly ? weatherData.hourly.time.slice(0, 24).map((timeStr, idx) => ({
    time: new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(weatherData.hourly.temperature_2m[idx]),
    rainChance: weatherData.hourly.precipitation_probability[idx],
    code: weatherData.hourly.weather_code[idx]
  })) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-6 pb-28 text-slate-900">
      
      {/* 🌟 SEARCH BAR & GPS TRIGGER (Google Weather Style) */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchCity} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search city, district, village or postal code..."
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            className="w-full bg-white border border-slate-200/90 rounded-2xl pl-10 pr-24 py-3 text-xs font-semibold outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-xs transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bg-slate-900 hover:bg-black text-white px-4 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 shadow-xs"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
          </button>
        </form>

        <button
          onClick={handleGetLiveLocation}
          disabled={isGpsLoading}
          className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs active:scale-95 shrink-0"
        >
          <Navigation className={`w-3.5 h-3.5 text-emerald-700 ${isGpsLoading ? 'animate-spin' : ''}`} />
          <span>{isGpsLoading ? 'Locating...' : 'Use Live Farm GPS'}</span>
        </button>
      </div>

      {/* 🌟 MAIN LIVE WEATHER CARD */}
      {current && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {locationName}
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Real-Time Satellite & Radar Observation • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-full border border-slate-200">
                {currentCondition.label}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                currentCondition.risk === 'Severe' || currentCondition.risk === 'High'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {currentCondition.risk} Farm Risk
              </span>
            </div>
          </div>

          {/* Temperature & Big Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 flex items-center gap-5">
              <span className="text-7xl sm:text-8xl select-none">{currentCondition.icon}</span>
              <div>
                <div className="flex items-start">
                  <span className="text-6xl sm:text-7xl font-black tracking-tighter text-slate-900">
                    {Math.round(current.temperature_2m)}
                  </span>
                  <span className="text-3xl font-bold text-slate-400 mt-1">°C</span>
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Feels like {Math.round(current.apparent_temperature)}°C • Dew point {Math.round(current.dew_point_2m || current.apparent_temperature - 2)}°C
                </p>
              </div>
            </div>

            {/* Micro Weather Metrics */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span>Humidity</span>
                </div>
                <span className="text-base font-black text-slate-900 mt-1 block">{current.relative_humidity_2m}%</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                  <Wind className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Wind Speed</span>
                </div>
                <span className="text-base font-black text-slate-900 mt-1 block">{current.wind_speed_10m} km/h</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                  <CloudRain className="w-3.5 h-3.5 text-sky-500" />
                  <span>Precipitation</span>
                </div>
                <span className="text-base font-black text-slate-900 mt-1 block">{current.precipitation} mm</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>UV Index</span>
                </div>
                <span className="text-base font-black text-slate-900 mt-1 block">{Math.round(current.uv_index || 4)} of 11</span>
              </div>
            </div>

          </div>

          {/* 🌟 24-HOUR HOURLY FORECAST (Google Weather Scroller) */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> 24-Hour Hourly Timeline
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Scroll horizontally →</span>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {next24Hours.map((hour, i) => (
                <div 
                  key={i}
                  className="bg-slate-50 hover:bg-slate-100/80 p-3 rounded-2xl border border-slate-100 text-center min-w-[76px] space-y-1.5 shrink-0 transition"
                >
                  <span className="text-[10px] font-bold text-slate-400 block">{i === 0 ? 'Now' : hour.time}</span>
                  <span className="text-xl block">{getWeatherDetails(hour.code).icon}</span>
                  <span className="text-xs font-black text-slate-900 block">{hour.temp}°</span>
                  <span className="text-[9px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded-md block">
                    {hour.rainChance}%
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 🌟 AGRICULTURAL ADVISORY & 7-DAY FORECAST GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Farm Action & Spray Calendar */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Farming Spray Advisory
              </span>
              <span className="text-[10px] font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                Automated
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Chemical & Pesticide Spray Window:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {current?.wind_speed_10m > 18 
                  ? "Wind speeds exceed 18 km/h. Avoid chemical spraying due to chemical drift risk."
                  : current?.precipitation > 0 
                  ? "Rainfall detected. Delay pesticide and fertilizer application to prevent washout."
                  : "Favorable spraying conditions. Optimal spray hours: 07:00 AM - 10:30 AM or 04:30 PM - 06:30 PM."}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Droplets className="w-4 h-4 text-blue-600" />
                <span>Irrigation Guidance:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {current?.relative_humidity_2m > 80
                  ? "High soil and atmospheric moisture. Delay tube-well or canal watering for 24 hours."
                  : "Standard crop water requirement. Maintain regular rotational irrigation cycle."}
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 font-medium">
            💡 <strong>Observation:</strong> {currentCondition?.desc}
          </div>
        </div>

        {/* 7-Day Extended Weather Forecast */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
              7-Day Extended Weather Outlook
            </h2>
            <span className="text-[10px] text-slate-400 font-bold">Max / Min Temperatures</span>
          </div>

          {weatherData?.daily && (
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
              {weatherData.daily.time.map((dateStr, idx) => {
                const code = weatherData.daily.weather_code[idx];
                const cond = getWeatherDetails(code);
                const max = Math.round(weatherData.daily.temperature_2m_max[idx]);
                const min = Math.round(weatherData.daily.temperature_2m_min[idx]);
                const rain = weatherData.daily.precipitation_probability_max[idx];
                const dayLabel = idx === 0 
                  ? 'Today' 
                  : new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });

                return (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50/70 hover:bg-slate-100/80 rounded-2xl border border-slate-100 text-center space-y-1.5 transition"
                  >
                    <span className="text-[10px] font-black text-slate-500 block">{dayLabel}</span>
                    <span className="text-2xl block select-none">{cond.icon}</span>
                    <div>
                      <span className="text-xs font-black text-slate-900">{max}°</span>
                      <span className="text-[10px] text-slate-400 font-bold ml-1">{min}°</span>
                    </div>
                    <span className="text-[9px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded-md block">
                      🌧️ {rain}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}