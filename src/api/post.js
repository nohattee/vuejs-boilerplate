import request from "@/utils/request";

const API_RESOURCE = "posts";

export default {
  list(params) {
    return request.get(`${API_RESOURCE}`, { params });
  },

  create(data) {
    return request.post(`${API_RESOURCE}`, data);
  },

  get(post_id) {
    return request.get(`${API_RESOURCE}/${post_id}`);
  },

  update(post_id, data) {
    return request.put(`${API_RESOURCE}/${post_id}`, data);
  },

  delete(post_id) {
    return request.delete(`${API_RESOURCE}/${post_id}`);
  },
};
