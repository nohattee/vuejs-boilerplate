import authAPI from "@/api/auth";

const state = {
  token: "",
  roles: [],
  name: "",
  avatar: "",
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },

  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },

  SET_NAME: (state, name) => {
    state.name = name;
  },

  SET_EMAIL: (state, email) => {
    state.email = email;
  },
};

const actions = {
  login({ commit }, credentials) {
    const { email, password } = credentials;
    return new Promise((resolve, reject) => {
      authAPI
        .login({ email: email.trim(), password: password })
        .then((response) => {
          const { data } = response;
          commit("SET_TOKEN", data.access_token);
          commit("SET_NAME", data.user.name);
          commit("SET_EMAIL", data.user.email);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
