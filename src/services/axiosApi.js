import axios from "axios";

// Using environment variable for the API base URL
const baseURL = `${process.env.REACT_APP_API_BASE_URL}/api`;

const accessToken = localStorage.getItem("access_token");

const axiosAPI = axios.create({
  baseURL: baseURL,
  timeout: 50000,
  withCredentials: false,
  headers: {
    Authorization: accessToken ? "Bearer " + accessToken : null,
    "Content-Type": "application/json",
    accept: "application/json"
  }
});

export function setNewHeaders(response) {
  axiosAPI.defaults.headers["Authorization"] =
    "Bearer " + response.data.access_token;
  localStorage.setItem("access_token", response.data.access_token);
  localStorage.setItem("refresh_token", response.data.refresh_token);
}

export function setProfileHeaders(response) {
  localStorage.setItem("profile", JSON.stringify(response.data));
}

export default axiosAPI;
