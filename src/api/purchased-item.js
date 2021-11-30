import request from "@/utils/request";

const API_RESOURCE = "purchased-items";

export default {
  list(params) {
    return request.get(`${API_RESOURCE}`, { params });
  },

  create(data) {
    return request.post(`${API_RESOURCE}`, data);
  },

  get(purchased_item_id) {
    return request.get(`${API_RESOURCE}/${purchased_item_id}`);
  },

  update(purchased_item_id, data) {
    return request.put(`${API_RESOURCE}/${purchased_item_id}`, data);
  },

  delete(purchased_item_id) {
    return request.delete(`${API_RESOURCE}/${purchased_item_id}`);
  },
};
