import request from "@/utils/request";

const API_RESOURCE = "post-categories";

export default {
  list(params) {
    return request.get(`${API_RESOURCE}`, { params });
  },

  create(data) {
    return request.post(`${API_RESOURCE}`, data);
  },

  update({ user_id, full_name, email, password }) {
    return request.put(`${API_RESOURCE}/${user_id}`, {
      full_name,
      email,
      password,
    });
  },
};
