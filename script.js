const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherCard = document.getElementById('weather-card');
const errorMsg = document.getElementById('error-msg');

window.addEventListener('DOMContentLoaded', () => {
    const savedCity = localStorage.getItem('lastSearchedCity');
    if (savedCity) {
        cityInput.value = savedCity;
        getWeatherData(savedCity);
    }
});

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});

async function getWeatherData(cityName) {
    try {
        errorMsg.classList.add('hidden');

        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            showError("City not found. Please check the spelling!");
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        const currentWeather = weatherData.current_weather;

        document.getElementById('city-name').innerText = `${name}, ${country}`;
        document.getElementById('temperature').innerText = currentWeather.temperature;
        document.getElementById('weather-desc').innerText = `Wind Direction: ${currentWeather.winddirection}°`;
        document.getElementById('wind-speed').innerText = `${currentWeather.windspeed} km/h`;
        document.getElementById('coords').innerText = `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;

        weatherCard.classList.remove('hidden');
        localStorage.setItem('lastSearchedCity', name);

    } catch (err) {
        showError("Failed to fetch weather data. Please try again.");
        console.error(err);
    }
}

function showError(msg) {
    weatherCard.classList.add('hidden');
    errorMsg.innerText = msg;
    errorMsg.classList.remove('hidden');
}
