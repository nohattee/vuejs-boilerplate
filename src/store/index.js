import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

function loadStoreModules() {
  const stores = require.context(
    "@/store/modules",
    true,
    /[A-Za-z0-9-_,\s]+\.js$/i
  );
  const modules = stores.keys().reduce((modules, modulePath) => {
    const matched = modulePath.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const moduleName = matched[1];
      modules[moduleName] = stores(modulePath).default;
      return modules;
    }
  }, {});
  return modules;
}

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: loadStoreModules(),
  plugins: [createPersistedState()],
});
