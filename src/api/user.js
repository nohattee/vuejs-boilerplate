import request from "@/utils/request";

export default {
  list(params) {
    return request.get("users", { params });
  },

  create(data) {
    return request.post("users", data);
  },

  update(data) {
    const { user_id, full_name, email, password } = data;
    return request.put(`users/${user_id}`, {
      full_name,
      email, 
      password,
    });
  },
};
