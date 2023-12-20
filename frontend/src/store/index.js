import Vue from "vue";
import Vuex from "vuex";
import posts from "./posts";
import messenger from "./messenger";

import { socket } from "../services/Socket";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    drawerSearch: false,
    settings: "",
    search: "",
    status: "",
    snackbar: false,
    user: JSON.parse(localStorage.getItem("user")),
  },
  mutations: {
    SET_DRAWER_SETTINGS: function(state, value){
      state.settings = value;
    },
    SET_SEARCH_USER: function (state, value) {
      state.search = value;
    },
    SET_DRAWER_SEARCH: function (state, value) {
      state.drawerSearch = value;
    },
    SET_STATUS: function (state, status) {
      state.status = status;
    },
    SET_SNACKBAR: function (state, snackbar) {
      state.snackbar = snackbar;
    },
    LOG_USER: function (state) {
      state.user = JSON.parse(localStorage.getItem("user"));
    },
    LOGOUT_USER: function (state) {
      localStorage.clear();
      state.user = {};
    },
  },
  actions: {
    loginUser: ({ commit }, user) => {
      localStorage.setItem("user", JSON.stringify(user.user));
      localStorage.setItem("token", JSON.stringify(user.token));
      commit("LOG_USER");
      location.reload();
    },
    logout: ({ commit }, expired) => {
      if (expired) commit("SET_STATUS", "Session expiré !");
      socket.disconnect();
      commit("LOGOUT_USER");
      location.reload();
    },
  },
  modules: {
    posts,
    messenger,
  },
});

export default store;
