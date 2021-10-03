import request from "@/utils/request";

const API_RESOURCE = "auth";

export default {
  login(data) {
    return request.post(`${API_RESOURCE}/login`, data);
  },
};
