export interface WeatherResponse {
    weatherCondition: string;
    temperatureCategory: string;
    alerts: string;
}

interface Alert {
    event: string,
    description: string;
}