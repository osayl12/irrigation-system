import axios from "axios";

const API_BASE = "http://172.20.10.4:3000";

export const api = axios.create({
  baseURL: API_BASE,
    headers: {
    "Content-Type": "application/json"
  },
});
