import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

export const getSensorsByPot = (potId) =>
  api.get(`/esp/pot/${potId}`);
