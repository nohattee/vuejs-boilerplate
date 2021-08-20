import axios from "axios";
import store from "@/store";

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 5000,
});

instance.interceptors.request.use(
  (config) => {
    if (store.state.user.token) {
      config.headers["Authorization"] = store.state.user.token;
    }

    if (typeof config.headers["Content-Type"] === "undefined") {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
