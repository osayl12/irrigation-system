import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

export const sendAvg = (data) => {
  return api.post("/esp", data);
};

export const getSensorsByPot = (potId) => {
  return api.get(`/esp/pot/${potId}`);
};
