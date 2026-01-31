import axios from "axios";
import NProgress from "nprogress";

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

const baseURL = process.env.NEXT_PUBLIC_USER_AUTH_URL;

export const userHttp = axios.create({
  baseURL
});

userHttp.interceptors.request.use((config) => {
  if ((config as any).intercept === false) return config;

  startProgress();

  const token = '';
  if (token) config.headers.authorization = `Bearer ${token}`;

  return config;
});

// Response interceptor to stop progress
userHttp.interceptors.response.use(
  (response) => {
    stopProgress();
    return response;
  },
  (error) => {
    stopProgress();
    return Promise.reject(error);
  }
);