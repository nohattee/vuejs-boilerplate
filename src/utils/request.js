import axios from "axios";
import store from "@/store";
// import router from "@/router";

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 5000,
});

instance.interceptors.request.use(
  (config) => {
    if (store.state.currentUser.token) {
      config.headers["Authorization"] =
        "Bearer " + store.state.currentUser.token;
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

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    // if (error.response) {
    //   if (error.response.status === 401) {
    //     store.commit("currentUser/SET_TOKEN", "");
    //     router.push({ name: "Login" });
    //   }
    // }
    return Promise.reject(error);
  }
);

export default instance;
