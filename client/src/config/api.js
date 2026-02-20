// src/config/api.js

// detect protocol automatically
const protocol = window.location.protocol === "https:" ? "https" : "http";

// backend port (change only here if needed)
const BACKEND_PORT = 5000;

// final base url
export const BASE_URL =
  import.meta.env.VITE_API_URL ||
  `${protocol}://${window.location.hostname}:${BACKEND_PORT}`;
