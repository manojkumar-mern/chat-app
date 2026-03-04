const protocol = window.location.protocol === "https:" ? "https" : "http";

const BACKEND_PORT = 5000;

// base url
export const BASE_URL =
  import.meta.env.VITE_API_URL ||
  `${protocol}://${window.location.hostname}:${BACKEND_PORT}`;
