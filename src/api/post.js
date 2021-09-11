import request from "@/utils/request";

export default {
  list(params) {
    return request.get("posts", { params });
  },

  create(data) {
    return request.post("posts", data);
  },

  update({ user_id, full_name, email, password }) {
    return request.put(`posts/${user_id}`, {
      full_name,
      email,
      password,
    });
  },
};
