import store from "../store/index";

const axios = require("axios");

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
});

class ApiClient {
  headers() {
    return {
      headers: {
        Authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    };
  }

  get(path) {
    return new Promise((resolve, reject) => {
      instance
        .get(path, this.headers())
        .then((response) => resolve(response))
        .catch((e) => {
          if (e.response.status === 401) {
            store.dispatch("logout", true);
          }
          reject(e);
        });
    });
  }

  post(path, body) {
    return new Promise((resolve, reject) => {
      instance
        .post(path, body, this.headers())
        .then((response) => resolve(response))
        .catch((e) => {
          if (e.response.status === 401) {
            store.dispatch("logout", true);
          }
          reject(e);
        });
    });
  }

  put(path, body) {
    return new Promise((resolve, reject) => {
      instance
        .put(path, body, this.headers())
        .then((response) => resolve(response))
        .catch((e) => {
          if (e.response.status === 401) {
            store.dispatch("logout", true);
          }
          reject(e);
        });
    });
  }

  delete(path) {
    return new Promise((resolve, reject) => {
      instance
        .delete(path, this.headers())
        .then((response) => resolve(response))
        .catch((e) => {
          if (e.response.status === 401) {
            store.dispatch("logout", true);
          }
          reject(e);
        });
    });
  }
}

export const apiClient = new ApiClient();
