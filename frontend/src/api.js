import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001",
});

export const getMissions = () => API.get("/missions");
export const getMission = (id) => API.get(`/missions/${id}`);
export const createMission = (data) => API.post("/missions", data);
export const updateMission = (id, data) => API.put(`/missions/${id}`, data);
export const deleteMission = (id) => API.delete(`/missions/${id}`);
export const getStats = () => API.get("/stats");

export default API;
