import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:8080/api"; // For testing purpose backend API_URL = "http://localhost:8080/api";
// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 60 * 1000,
    headers: {
        "Content-Type": "application/json"
    }
});

// Intercept requests to include the Authorization token

axiosInstance.interceptors.request.use((config) => {
    // Middleware
    return config;
}, (error: AxiosError) => {
    return Promise.reject(error)
});

axiosInstance.interceptors.response.use((response) => {
    // Middleware
    return response;
}, (error: AxiosError) => {
    if (error) {
        console.error("ERROR : ", error);
    }
    return Promise.reject(error)
});


export default axiosInstance;