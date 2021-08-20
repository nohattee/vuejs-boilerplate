const state = {
  locale: "",
};

const mutations = {
  SET_LOCALE: (state, locale) => {
    state.locale = locale;
  },
};

const actions = {
  setLocale({ commit }, locale) {
    commit("SET_LOCALE", locale);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
