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

  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
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
          commit("SET_AVATAR", data.user.avatar);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  logout({ commit }) {
    commit("SET_TOKEN", "");
    commit("SET_NAME", "");
    commit("SET_EMAIL", "");
    commit("SET_AVATAR", "");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
