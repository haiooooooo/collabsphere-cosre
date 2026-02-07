// const axios = require('axios');

// module.exports = axios.create({
//   baseURL: 'https://collabsphere-server.onrender.com',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

import axios from "axios";
import Cookies from "js-cookie";
import { mockNetworkResponse } from "./mockServer";

/**
 * API client.
 *
 * IMPORTANT:
 * - Do NOT hard-code the backend URL.
 * - Configure it via env at build time.
 *
 * Create a .env file in the project root:
 *   REACT_APP_API_BASE_URL=http://localhost:8000
 *
 * For production deployments, set the env var in the hosting platform.
 */
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API_URL ||
  // Reasonable dev default (update to match your backend).
  "http://localhost:8000";

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Prevent axios from throwing on non-2xx so UI can handle statuses gracefully.
  validateStatus: () => true,
});

// Attach auth headers automatically when possible (keeps legacy code working).
client.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    const uid = Cookies.get("uid");

    config.headers = config.headers || {};
    if (token && !config.headers.authorization) {
      // Some endpoints in legacy code expect Token, others expect Bearer.
      // If caller set it explicitly, we keep it; otherwise default to Token.
      config.headers.authorization = `Token ${token}`;
    }
    if (uid && !config.headers.uid) {
      config.headers.uid = uid;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Convert NETWORK errors into a resolved response-like object instead of
// an unhandled rejection (prevents CRA overlay + keeps the app usable offline).
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend is offline and DEMO mode is enabled, serve mock data
    // so the UI stays usable.
    const maybe = mockNetworkResponse(error?.config);
    if (maybe) return Promise.resolve(maybe);

    return Promise.resolve({
      status: 0,
      data: null,
      error,
      isNetworkError: true,
      message: error?.message || "Network error",
      config: error?.config,
      headers: {},
    });
  }
);

export default client;

export { BASE_URL };
