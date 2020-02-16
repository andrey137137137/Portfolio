import axios from "axios";

import { SET_CONFIG, SET_PROFILE } from "@common/store/mutation-types";

const defaultData = {
  pageConfig: {
    name: "",
    isTopWrapTitle: false,
    isBlog: false,
    isContent: false,
    sections: 0
  }
};

export default {
  namespaced: true,
  state: {
    pageConfig: {
      // name: defaultData.name,
      // isTopWrapTitle: defaultData.isTopWrapTitle,
      // isBlog: defaultData.isBlog,
      // isContent: defaultData.isContent,
      // sections: defaultData.sections
    },
    userProfile: {}
  },
  getters: {
    config(state) {
      return state.pageConfig;
    },
    profile(state) {
      return state.userProfile;
    }
  },
  actions: {
    setConfig({ commit }, data) {
      commit(SET_CONFIG, data);
      axios.get("user").then(res => {
        commit(SET_PROFILE, res.data.items[0].profile);
      });
    }
    // setProfile({ commit }) {
    //   axios.get("user").then(res => {
    //     commit(SET_PROFILE, res.data.items[0].profile);
    //   });
    // }
  },
  mutations: {
    [SET_CONFIG](state, data) {
      const tempData = { ...defaultData.pageConfig, ...data };

      for (const key in tempData) {
        // if (state.data.hasOwnProperty(key)) {
        state.pageConfig[key] = tempData[key];
        // }
      }
    },
    [SET_PROFILE](state, data) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          state.userProfile[key] = data[key];
        }
      }
    }
  }
};
