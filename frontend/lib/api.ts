import axios from "axios";
export const API_BASE_URL = "http://localhost:8000";
export const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});