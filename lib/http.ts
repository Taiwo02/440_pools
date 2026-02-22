import axios from "axios";
import NProgress from "nprogress";
import { deleteCrossSubdomainCookie, getCrossSubdomainCookie } from "./utils";

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

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const http = axios.create({
  baseURL
});

http.interceptors.request.use((config) => {
  if ((config as any).intercept === false) return config;

  startProgress();

  const token = getCrossSubdomainCookie("440_token");
  if (token) config.headers.authorization = `Bearer ${token}`;

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

    if (error.response?.status === 401) {
      deleteCrossSubdomainCookie("440_token");
      localStorage.removeItem("merchant");
      window.location.href = "/account";
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