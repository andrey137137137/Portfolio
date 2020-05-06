import { FORBIDDEN } from "@httpSt";
import { SET } from "@common/store/mutation-types";

export default {
  namespaced: true,
  state: {
    status: 0,
    message: "",
  },
  getters: {
    status: (state) => state.status,
    message: (state) => state.message,
  },
  actions: {
    setFormMessage({ commit }, data) {
      commit(SET, data);
    },
  },
  mutations: {
    [SET](state, data) {
      const { status, message } = data;

      switch (status) {
        case FORBIDDEN:
          state.message = message;
          break;
        case 0:
          state.message = "";
          break;

        default:
          state.message = "Невозможно подключиться к серверу";
      }

      state.status = status;
    },
  },
};
