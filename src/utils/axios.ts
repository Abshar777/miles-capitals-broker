"use client";
import axios from "axios";

// Use relative /proxy path — Next.js rewrites it to the backend server-side.
// The real backend URL is NEVER sent to the browser.
const baseURL = "/proxy";

const AxiosInstance = (token: string = "") => {
  const instance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  instance.interceptors.request.use((config) => {
    if (typeof window !== "undefined" && config.method === "get") {
      const params = new URLSearchParams(window.location.search);

      const offset = params.get("skip");
      const skip = offset;
      const limit = params.get("limit");

      config.params = {
        ...config.params,
        ...(offset && { offset, skip }),
        ...(limit && { limit }),
        use_cache: false,
        skip_cache: true,
      };
    }

    return config;
  });

  return instance;
};
export default AxiosInstance;
