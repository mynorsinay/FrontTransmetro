import axios from "axios";

const api = axios.create({
  baseURL: "https://transmetroapi-djdhhjctangha3cb.canadacentral-01.azurewebsites.net/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

