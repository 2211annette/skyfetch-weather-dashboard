// Your OpenWeatherMap API Key
const API_KEY = '50dce4d05cb22bc7d43a4bc82cbe9278';  // Replace with your actual API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
// }

function WeatherApp(API_KEY){
    this.API_KEY=API_KEY;
    this.API_URL=API_URL;
    
    this.forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast'

    this.searchBtn = document.getElementById('search-btn');
    this.cityInput = document.getElementById('city-input');
    this.weatherDisplay = document.getElementById('weather-display');

    this.init();
}

// Modify getWeather method
WeatherApp.prototype.getWeather = async function (city) {
  this.showLoading();
  this.searchBtn.disabled = true;
  this.searchBtn.textContent = 'Searching...';

  // Build current weather URL
  const currentWeatherUrl =
    `${this.API_URL}?q=${city}&appid=${this.API_KEY}&units=metric`;

  try {
    // Fetch current weather + forecast together
    const [currentWeather, forecastData] = await Promise.all([
      axios.get(currentWeatherUrl),
      this.getForecast(city)
    ]);

    // Display current weather
    this.displayWeather(currentWeather.data);

    // Display forecast
    this.displayForecast(forecastData);

  } catch (error) {
    console.error('Error:', error);

    if (error.response && error.response.status === 404) {
      this.showError('City not found. Please check spelling.');
    } else {
      this.showError('Something went wrong. Please try again.');
    }

  } finally {
    this.searchBtn.disabled = false;
    this.searchBtn.textContent = 'Search';
  }
};

WeatherApp.prototype.displayWeather=function(data) {
    // Extract the data we need
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    // Create HTML to display
    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;

    // Put it on the page
    this.weatherDisplay.innerHTML = weatherHTML;

    this.cityInput.focus();
}

WeatherApp.prototype.showError=function(message) {
    const weatherDisplay = document.getElementById("weather-display");

    const errorHTML = `
    <div class="error-message">
      ⚠️ <strong>Error:</strong> ${message}
    </div>
  `;

    this.weatherDisplay.innerHTML = errorHTML;
}

WeatherApp.prototype.handleSearch=function() {
    const city = this.cityInput.value.trim();

    // Validate input
    if (city === "") {
        this.showError("Please enter a city name");
        return;
    }
    if (!city) {
        this.showError("Please enter a city name");
        return;
    }

    if (city.length < 2) {
        this.showError("City name too short");
        return;
    }
    // Call weather function
    this.getWeather(city);
}

WeatherApp.prototype.init = function () {
  // Click event on search button
  this.searchBtn.addEventListener('click', this.handleSearch.bind(this));

  // Enter key support on input
  this.cityInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  }.bind(this));

  // Show welcome message on load
  this.showWelcome();
};

// getWeather('Tokyo');
WeatherApp.prototype.showLoading=function() {

    const loadingHTML = `
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  `;

    this.weatherDisplay.innerHTML = loadingHTML;
}

WeatherApp.prototype.showWelcome = function() {
    // TODO: Create welcome HTML
    const welcomeHTML = `
        <div class="welcome-message">
            🌤️ Enter a city name to get started!
        </div>
    `;
    
    this.weatherDisplay.innerHTML = welcomeHTML;
};

// Create getForecast method (async)
WeatherApp.prototype.getForecast = async function (city) {
  // Build forecast API URL
  const url = `${this.forecastUrl}?q=${city}&appid=${this.API_KEY}&units=metric`;

  try {
    // Fetch forecast data
    const response = await axios.get(url);

    // Return the data
    return response.data;

  } catch (error) {
    console.error('Error fetching forecast:', error);
    // Throw error to be caught by caller
    throw error;
  }
};

WeatherApp.prototype.processForecastData = function (data) {
  // Filter forecast list to get one entry per day at 12:00:00
  const dailyForecasts = data.list.filter(function (item) {
    // dt_txt format: "YYYY-MM-DD 12:00:00"
    return item.dt_txt.includes('12:00:00');
  });

  // Take only first 5 days
  return dailyForecasts.slice(0, 5);
};

// Create displayForecast method
WeatherApp.prototype.displayForecast = function (data) {
  // Process the forecast data
  const dailyForecasts = this.processForecastData(data);

  // Create HTML for each forecast day
  const forecastHTML = dailyForecasts.map(function (day) {
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const temp = Math.round(day.main.temp);
    const description = day.weather[0].description;
    const icon = day.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    return `
      <div class="forecast-card">
        <h4>${dayName}</h4>
        <img src="${iconUrl}" alt="${description}">
        <div class="forecast-temp">${temp}°C</div>
        <p class="forecast-desc">${description}</p>
      </div>
    `;
  }).join('');

  // Create forecast section
  const forecastSection = `
    <div class="forecast-section">
      <h3 class="forecast-title">5-Day Forecast</h3>
      <div class="forecast-container">
        ${forecastHTML}
      </div>
    </div>
  `;

  // Append forecast below current weather
  this.weatherDisplay.innerHTML += forecastSection;
};

const app = new WeatherApp(API_KEY);