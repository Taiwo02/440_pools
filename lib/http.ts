import axios from "axios";
import NProgress from "nprogress";
import { deleteCrossSubdomainCookie, getCrossSubdomainCookie, setCrossSubdomainCookie } from "./utils";
import { v4 as uuidv4 } from "uuid";

let activeRequests = 0;

const startProgress = () => {
  if (activeRequests === 0) {
    NProgress.start();
  }
  activeRequests++;
};

const stopProgress = () => {
  activeRequests--;
  if (activeRequests <= 0) {
    activeRequests = 0;
    NProgress.done();
  }
};

// @ts-ignore
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const http = axios.create({
  baseURL
});

function clearAuthSession() {
  deleteCrossSubdomainCookie("440_token");
  deleteCrossSubdomainCookie("440_refresh_token");
  if (typeof window !== "undefined") {
    localStorage.removeItem("merchant");
  }
}

function redirectToAccountIfNeeded() {
  if (typeof window === "undefined") return;
  const path = window.location.pathname || "";
  // Login should only be forced at checkout time.
  if (!path.startsWith("/checkout")) return;
  // Avoid reloading the same route endlessly when already on account pages.
  if (path.startsWith("/account")) return;
  window.location.assign("/account");
}

http.interceptors.request.use((config) => {
  if ((config as any).intercept === false) return config;

  startProgress();

  const token = getCrossSubdomainCookie("440_token");
  if (token) config.headers.authorization = `Bearer ${token}`;

  // Only generate a key if it's the specific endpoint AND one doesn't exist yet
  if (
    config.method === 'post' &&
    config.url?.includes("/buyer/initiate-payment") &&
    !config.headers['Idempotency-Key'] // Check if key is already there
  ) {
    config.headers['Idempotency-Key'] = uuidv4();
  }

  return config;
});

// Response interceptor to stop progress
http.interceptors.response.use(
  (response) => {
    stopProgress();
    return response;
  },
  async (error) => {
    stopProgress();

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/buyer/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCrossSubdomainCookie("440_refresh_token");
        if (!refreshToken) {
          clearAuthSession();
          redirectToAccountIfNeeded();
          return Promise.reject(error);
        }

        const res = await http.post("/buyer/refresh-token", {
          refreshToken,
        });

        const newAccessToken = res.data.data.token;
        const newRefreshToken = res.data.data.refreshToken;
        setCrossSubdomainCookie("440_token", newAccessToken, 1);
        setCrossSubdomainCookie("440_refresh_token", newRefreshToken, 30);

        originalRequest.headers.authorization =
          `Bearer ${newAccessToken}`;

        return http(originalRequest);
      } catch (refreshError) {
        clearAuthSession();
        redirectToAccountIfNeeded();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const noToken = axios.create({
  baseURL
})

noToken.interceptors.request.use((config) => {
  if ((config as any).intercept === false) return config;
  startProgress();

  return config;
});

// Response interceptor to stop progress
noToken.interceptors.response.use(
  (response) => {
    stopProgress();
    return response;
  },
  (error) => {
    stopProgress();
    return Promise.reject(error);
  }
);

export default http;