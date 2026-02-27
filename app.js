// Your OpenWeatherMap API Key
const API_KEY = '50dce4d05cb22bc7d43a4bc82cbe9278';  // Replace with your actual API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data
// function getWeather(city) {
//     // Build the complete URL
//     const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

//     // Make API call using Axios
//     axios.get(url)
//         .then(function(response) {
//             console.log('Weather Data:', response.data);
//             displayWeather(response.data);
//         })
//         .catch(function(error) {
//             console.error('Error fetching weather:', error);
//             document.getElementById('weather-display').innerHTML = 
//                 '<p class="loading">Could not fetch weather data. Please try again.</p>';
//         });
// }
async function getWeather(city) {
    showLoading()

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    // Disable search button
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";
    try {
        const response = await axios.get(url);
        displayWeather(response.data);
    } catch (error) {
        showError(error);
    }finally {
    // Re-enable search button
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
  }
}

// Function to display weather data
function displayWeather(data) {
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
    document.getElementById('weather-display').innerHTML = weatherHTML;

    cityInput.focus();
}

function showError(message) {
    const weatherDisplay = document.getElementById("weather-display");

    const errorHTML = `
    <div class="error-message">
      ⚠️ <strong>Error:</strong> ${message}
    </div>
  `;

    weatherDisplay.innerHTML = errorHTML;
}

// Get references to HTML elements
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

// Function to handle search
function handleSearch() {
    const city = cityInput.value.trim();

    // Validate input
    if (city === "") {
        showError("Please enter a city name");
        return;
    }
    if (!city) {
        showError("Please enter a city name");
        return;
    }

    if (city.length < 2) {
        showError("City name too short");
        return;
    }
    // Call weather function
    getWeather(city);
}

// Add click event listener
searchBtn.addEventListener("click", handleSearch);

// BONUS: Enter key support
cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        handleSearch();
    }
});
// Call the function when page loads
// getWeather('Tokyo');
// Create showLoading function
function showLoading() {
    const weatherDisplay = document.getElementById("weather-display");

    const loadingHTML = `
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  `;

    weatherDisplay.innerHTML = loadingHTML;
}
// Show welcome message instead
document.getElementById("weather-display").innerHTML = `
  <div class="welcome-message">
    🌤️ Enter a city name to get started!
  </div>
`;