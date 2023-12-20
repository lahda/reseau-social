<template>
  <v-card style="margin: 0 !important" :class="$vuetify.breakpoint.width < 500 ? 'rounded-0' : 'rounded-lg pa-1'" :elevation="$vuetify.breakpoint.width < 500 ? '0' : '1'">
    <v-layout class="d-flex mx-3 my-1">
      <router-link :to="`/profile/${user.uuid}`" class="float-left">
        <Avatar :avatar="user.avatar" size="38" />
      </router-link>
      <div @click="openPostDialog" class="to_post mx-2">
        Ecrivez quelque chose...
      </div>
    </v-layout>
    <v-divider :class="$vuetify.breakpoint.width < 500 ? 'mt-2' : 'my-2'"></v-divider>
    <v-btn
      style="width: 100%"
      depressed
      class="transparent darken-1 gray--text"
      @click="takeContent()"
    >
      <v-icon left>mdi-image</v-icon>
      <span>image / gif</span>
    </v-btn>
    <v-file-input
      ref="file"
      style="visibility: hidden; width: 0; position: absolute"
      label="File input"
      hide-input
      multiple
      @change="onFileContent"
    ></v-file-input>
  </v-card>
</template>

<script>
import { apiClient } from "../services/ApiClient";
import { mapState, mapMutations, mapActions } from "vuex";
import Avatar from "./Avatar";

export default {
  name: "ToPost",
  components: { Avatar },
  data() {
    return {};
  },
  computed: {
    ...mapState(["user", "posts"]),
  },
  methods: {
    ...mapMutations(["ADD_BODY_FILES"]),
    ...mapActions(["openDialogPost"]),
    openPostDialog() {
      this.openDialogPost({
        title: "Créer une publication",
        payload: { status: "post", dialog: true },
      });
    },
    takeContent: function() {
      this.$refs.file.$children[0].$el.click();
    },
    onFileContent(event) {
      this.ADD_BODY_FILES(event);
       this.openDialogPost({
        title: "Créer une publication",
        payload: { status: "post", dialog: true },
      });
    },
    createPost() {
      apiClient.post(`/post`, this.posts.body).then((newPost) => {
        this.$emit("newPost", newPost.data);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.to_post {
  padding: 7px 15px;
  color: rgba(0, 0, 0, 0.38);
  background-color: #f0efef;
  border-radius: 30px;
  width: 100%;
  cursor: pointer;
  &:hover {
    background-color: #e2e1e1;
  }
}
</style>
