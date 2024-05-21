// Import the necessary modules
import express, { Request, Response } from 'express'; // Express framework for building web applications
import axios from 'axios'; // Axios for making HTTP requests
import dotenv from 'dotenv'; // Dotenv for loading environment variables
import { Alert, WeatherResponse } from './model';

// Load environment variables from .env file
dotenv.config();

// Create an Express application
export const app = express();

// Define the port number from environment variables or default to 3000
const PORT = process.env.PORT || 3000;
const MAX_COLD = process.env.MAX_COLD || "15";
const MIN_HEAT = process.env.MIN_HEAT || "25";

// Define a GET API endpoint for getting weather information
app.get('/get-weather', async (req: Request, res: Response) => {
    // Extract latitude and longitude from the query parameters
    const { lat, lon } = req.query;

    // Validation - Check if latitude and longitude are present in the query parameters
    if (!lat || !lon) {
        // If either latitude or longitude is missing, return a 400 Bad Request error
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Get the OpenWeather API key from environment variables
    // This must be generated in the open weather account
    const apiKey = process.env.OPENWEATHER_API_KEY;
    console.log(apiKey);
    // Construct the URL for the OpenWeather API request
    // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    console.log(url);
    try {
        // Make an HTTP GET request to the OpenWeather API
        const response = await axios.get(url);
        // Extract the data from the response
        const data = response.data;
            
        // Declare the response object with default values.
        let weatherRes: WeatherResponse = {
            weatherCondition : '',
            temperatureCategory: 'moderate',
            alerts: []
        };
        // console.log("Test data in response: ",data);
        // Extract the current weather condition and temperature
        
        weatherRes.weatherCondition = data.current.weather[0].main;
        const temperature = +data.current.temp;

        // Categorize the temperature as cold, moderate, or hot
        //let tempCategory: string = 'moderate';
        if (temperature < parseFloat(MAX_COLD)) {
            weatherRes.temperatureCategory = 'cold';
        } else if (temperature > parseFloat(MIN_HEAT)) {
            weatherRes.temperatureCategory = 'hot';
        }

        // Extract any weather alerts, if present
        // let alerts: string = 'No alerts';
        if (data.alerts && data.alerts.length > 0) {
            // weatherRes.alerts = data.alerts.map((alert: any) => alert.description).join(', ');
            weatherRes.alerts = data.alerts.map((alert: Alert) => ({description: alert.description, event: alert.event}));
        }

        
        // Send a JSON response with the weather condition, temperature category, and alerts
        res.json(weatherRes);
    } catch (error) {
        // Send a 500 Internal Server Error response if there's an issue fetching the weather data
        // console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

// Start the Express server and listen on the defined port
app.listen(PORT, () => {
    // Log a message indicating the server is running
    console.log(`Server is running on port ${PORT}`);
});
