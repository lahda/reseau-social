import { apiClient } from "../services/ApiClient";

export default {
  state: {
    posts: [],
    page: 1,
    lastPage: false,
    loading: false,
    dialogFormPost: false,
    statusPost: null,
    titleFormPost: null,
    isFormData: false,
    urlsContent: [],
    backupBody: null,
    modify: {
      postId: null,
      urlsContent: [],
      urls: "",
    },
    body: {
      title: "",
      content: [],
    },
    dialogGalleryFullScreen: false,
    itemsDialogGallery: [],
    indexDialogGallery: 0,
  },
  mutations: {
    LOADING_POST: function (state, value) {
      state.loading = value;
    },
    RESET_POSTS(state) {
      state.posts = [];
      state.page = 1;
      state.lastPage = false;
    },
    NEXT_PAGE(state) {
      state.page++;
    },
    LAST_PAGE_REACHED(state) {
      state.lastPage = true;
    },
    ADD_POSTS: function (state, posts) {
      state.posts = posts;
    },
    ADD_NEW_POST: function (state, newPost) {
      newPost.content = newPost.content.split(";");
      newPost.content.pop();
      state.posts.unshift(newPost);
    },
    UPDATE_POST: function (state, postUpdated) {
      postUpdated.content = postUpdated.content.split(";");
      postUpdated.content.pop();
      state.posts.forEach((post, index) => {
        if (post.id === postUpdated.id)
          state.posts.splice(index, 1, postUpdated);
      });
    },
    DELETE_POST: function (state, postId) {
      state.posts.forEach((post, index) => {
        if (post.id === postId) state.posts.splice(index, 1);
      });
    },
    SET_DIALOG_FORM_POST: function (state, payload) {
      state.dialogFormPost = payload.dialog;
      state.statusPost = payload.status;
    },
    SET_TITLE_FORM_POST: function (state, value) {
      state.titleFormPost = value;
    },
    MODE_POST: function (state) {
      state.body.title = state.backupBody.title;
      state.body.content = state.backupBody.content;
      state.urlsContent = state.backupBody.urlsContent;
      state.isFormData = state.backupBody.isFormData;
    },
    MODE_BACKUP: function (state) {
      state.backupBody = {};
      state.backupBody.title = state.body.title;
      state.backupBody.content = state.body.content;
      state.backupBody.urlsContent = state.urlsContent;
      state.backupBody.isFormData = state.isFormData;
    },
    MODE_MODIFY_POST: function (state, payload) {
      state.urlsContent = payload.urls;
      state.body.title = payload.title;
      state.modify.postId = payload.postId;
    },
    ADD_BODY_TITLE: function (state, value) {
      state.body.title = value;
    },
    ADD_BODY_FILES: function (state, event) {
      for (let i = 0; i < event.length; i++) {
        let url = URL.createObjectURL(event[i]);
        state.urlsContent.push(url);
        state.body.content.push(event[i]);
        if (state.statusPost === "modify") {
          state.modify.urlsContent.push(url);
        }
      }
      state.isFormData = true;
    },
    DELETE_FILE: function (state, index) {
      state.urlsContent.splice(index, 1);
      state.body.content.splice(index, 1);
    },
    DELETE_MODIFY_FILE: function (state, index) {
      for (const i of Object.keys(state.modify.urlsContent)) {
        if (state.urlsContent[index] === state.modify.urlsContent[i]) {
          state.body.content.splice(i, 1);
          state.modify.urlsContent.splice(i, 1);
        }
      }
      state.urlsContent.splice(index, 1);
    },
    DELETE_ALL_FILES: function (state) {
      state.body.content = [];
      state.isFormData = false;
      state.urlsContent = [];
    },
    FORMDATA_CONFIG: function (state) {
      if (state.isFormData) {
        let formData = new FormData();
        formData.append("title", state.body.title);
        if (state.statusPost === "modify")
          formData.append("urls", state.modify.urls);
        for (const i of Object.keys(state.body.content)) {
          console.log(state.body.content[i]);
          formData.append("content", state.body.content[i]);
        }
        state.body = formData;
      } else if (state.statusPost === "modify") {
        if (state.urlsContent.length > 0)
          state.body.content = state.modify.urls;
        else state.body.content = "";
      }
    },
    EMPTY_POST_FORM: function (state) {
      state.body = {
        title: "",
        content: [],
      };
      (state.modify = {
        postId: null,
        urlsContent: [],
        urls: "",
      }),
        (state.isFormData = false);
      state.urlsContent = [];
    },
    SET_DIALOG_GALLERY_FULL: function (state, value) {
      state.dialogGalleryFullScreen = value;
    },
    SET_ITEMS_DIALOG: function (state, items) {
      state.itemsDialogGallery = items;
    },
    SET_INDEX_DIALOG: function (state, index) {
      state.indexDialogGallery = index;
    },
  },
  actions: {
    openDialogPost: ({ commit, state }, { title, payload }) => {
      commit("SET_TITLE_FORM_POST", title);
      commit("SET_DIALOG_FORM_POST", payload);
      if (payload.status === "post" && state.backupBody != null) {
        commit("MODE_POST");
      }
    },
    closeDialogPost: ({ commit, state }, payload) => {
      if (state.statusPost === "post") {
        commit("MODE_BACKUP");
      } else if (state.statusPost === "modify") {
        commit("EMPTY_POST_FORM");
      }
      commit("SET_DIALOG_FORM_POST", payload);
    },
    deleteOneFile: function ({ commit, state }, index) {
      if (state.statusPost === "post") {
        commit("DELETE_FILE", index);
      } else if (state.statusPost === "modify") {
        commit("DELETE_MODIFY_FILE", index);
      }
    },
    sendThePost: function ({ state, commit, dispatch }) {
      if (state.statusPost === "modify") {
        for (let i = 0; i < state.urlsContent.length; i++) {
          state.modify.urls += state.urlsContent[i] + ";";
        }
      }
      commit("FORMDATA_CONFIG");
      if (state.statusPost === "post") {
        dispatch("createPost");
      } else if (state.statusPost === "modify") {
        dispatch("modifyPost");
      }
    },
    createPost: async function ({ state, commit, dispatch }) {
      commit("SET_STATUS", "loading");
      const response = await apiClient.post(`/post`, state.body);
      commit("ADD_NEW_POST", response.data);
      commit("SET_STATUS", "");
      commit("EMPTY_POST_FORM");
      dispatch("closeDialogPost", { status: null, dialog: false });
    },
    modifyPost: function ({ state, commit }) {
      apiClient
        .put(`/post/${state.modify.postId}`, state.body)
        .then((response) => {
          commit("UPDATE_POST", response.data);
          commit("EMPTY_POST_FORM");
        });
    },
    initializePosts({ dispatch, commit }, userUuid) {
      commit("RESET_POSTS");
      dispatch("getPosts", userUuid);
    },
    getPosts: function ({ commit, state }, userUuid = "") {
      commit("LOADING_POST", true);
      if (userUuid != "") userUuid = `&user=${userUuid}`;
      return apiClient
        .get(`/post?page=${state.page}${userUuid}`)
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            response.data[i].content = response.data[i].content.split(";");
            response.data[i].content.pop();
          }
          commit("ADD_POSTS", state.posts.concat(response.data));
          commit("LOADING_POST", false);
        });
    },
    async morePosts({ commit, dispatch, state }, userUuid) {
      if (state.lastPage) return;
      commit("NEXT_PAGE");
      const currentLength = state.posts.length;
      await dispatch("getPosts", userUuid);
      if (state.posts.length === currentLength) {
        commit("LAST_PAGE_REACHED");
      }
    },
    deleteOnePost: function ({ commit }, postId) {
      apiClient.delete(`/post/${postId}`).then(() => {
        commit("DELETE_POST", postId);
      });
    },
  },
};
