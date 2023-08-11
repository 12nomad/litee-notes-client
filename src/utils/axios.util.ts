import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

client.interceptors.request.use((config) => {
  const at = localStorage.getItem("notes_at");
  config.headers.Authorization = at ? `Bearer ${at}` : "";
  return config;
});

export default client;
