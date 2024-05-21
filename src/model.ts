export interface WeatherResponse {
    weatherCondition: string;
    temperatureCategory: string;
    alerts: Alert[];
}

export interface Alert {
    event: string,
    description: string;
}