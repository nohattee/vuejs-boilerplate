import request from "@/utils/request";

const API_RESOURCE = "files";

export default {
  list(params) {
    return request.get(`${API_RESOURCE}`, { params });
  },
  upload(files) {
    const form = new FormData();
    for (let file of files) {
      form.append("files[]", file);
    }
    return request.post(`${API_RESOURCE}`, form);
  },
};
