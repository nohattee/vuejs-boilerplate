import request from "@/utils/request";

const API_RESOURCE = "posts";

export default {
  list(params) {
    return request.get(`${API_RESOURCE}`, { params });
  },

  create(data) {
    return request.post(`${API_RESOURCE}`, data);
  },

  get(user_id) {
    return request.get(`${API_RESOURCE}/${user_id}`);
  },

  update(user_id, data) {
    return request.put(`${API_RESOURCE}/${user_id}`, data);
  },

  delete(user_id) {
    return request.delete(`${API_RESOURCE}/${user_id}`);
  },
};
