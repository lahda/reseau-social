<template>
  <v-card
    class="mt-1 py-1"
    :class="$vuetify.breakpoint.width < 500 ? 'rounded-0' : 'rounded-lg'"
    :elevation="$vuetify.breakpoint.width < 500 ? '0' : '1'"
    style="margin: 0 !important"
  >
    <v-card-title class="mx-3 my-1 pa-0">
      <router-link :to="`/profile/${post.user.uuid}`">
        <Avatar :avatar="post.user.avatar" size="38" />
      </router-link>
      <v-layout column class="ml-3">
        <router-link
          :to="`/profile/${post.user.uuid}`"
          class="text-body-2 font-weight-medium black--text"
        >
          {{ `${post.user.firstname} ${post.user.lastname}` }}
        </router-link>
        <span class="text-caption grey--text text--darken-2">
          {{
            moment(post.createdAt)
              .locale("fr")
              .fromNow()
          }}
        </span>
      </v-layout>
      <v-menu bottom left v-if="post.user.uuid === user.uuid || user.isAdmin">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item link @click="editPost(post.id)">
            <v-list-item-avatar>
              <v-icon>mdi-pencil</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>Modifier la publication</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="deletePost(post.id)">
            <v-list-item-avatar>
              <v-icon>mdi-delete</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>Supprimer la publication</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-card-text
      v-if="post.title != ''"
      style="white-space: pre-line; width: 100%"
      class="px-3 py-0 font-weight-regular title black--text"
    >
      {{ post.title }}
    </v-card-text>

    <v-layout
      v-if="post.content.length < 10"
      class="d-flex flex-wrap justify-center"
    >
      <img
        class="gallery"
        :class="resizeFiles"
        :style="post.content.length > 1 ? 'width: 49%' : 'width: 100%'"
        v-for="(url, index) in post.content"
        :key="url"
        :src="url"
        @click="galleryFullScreen(index)"
      />
    </v-layout>

    <v-container v-if="post.content.length >= 10" class="container_pictures">
      <h5 class="container_pictures--count">
        {{ post.content.length }} fichiers
      </h5>
      <Masonry :urls="post.content" />
    </v-container>

    <v-divider></v-divider>

    <Comment :likes="post.likes" :postId="post.id" />
  </v-card>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import Avatar from "./Avatar";
import Comment from "./Comment";
import Masonry from "./Masonry";

const moment = require("moment");

export default {
  name: "Post",
  components: { Avatar, Comment, Masonry },
  props: ["post"],
  data: () => {
    return {
      moment: moment,
    };
  },
  computed: {
    ...mapState(["user"]),
    resizeFiles() {
      let test = "";
      if (this.post.content.length > 3) test = "test1";
      if (this.post.content.length > 6) test = "test2";
      return test;
    },
  },
  methods: {
    ...mapActions(["openDialogPost", "deleteOnePost"]),
    ...mapMutations([
      "SET_DIALOG_GALLERY_FULL",
      "SET_ITEMS_DIALOG",
      "SET_INDEX_DIALOG",
      "SET_DIALOG_FORM_POST",
      "MODE_MODIFY_POST",
    ]),
    galleryFullScreen(index) {
      this.SET_ITEMS_DIALOG(this.post.content);
      this.SET_INDEX_DIALOG(index);
      this.SET_DIALOG_GALLERY_FULL(true);
    },
    switchGallery(event) {
      this.$refs.imagePrincipal.src = event.originalTarget.src;
    },
    editPost(postId) {
      this.MODE_MODIFY_POST({
        urls: [...this.post.content],
        title: this.post.title,
        postId,
      });
      this.openDialogPost({
        title: "Modifier une publication",
        payload: { status: "modify", dialog: true },
      });
    },
    deletePost(postId) {
      this.deleteOnePost(postId);
    },
  },
};
</script>

<style lang="scss" scoped>
.test1 {
  max-height: 150px !important;
}
.test2 {
  max-height: 100px !important;
  max-width: 32.5%;
}
.gallery {
  object-fit: cover;
  flex-grow: 1;
  margin: 1px;
  max-height: 400px;
  cursor: pointer;
}
.gallery--principal {
  max-width: 100%;
  height: 400px;
  object-fit: contain;
}
.gallery__bloc {
  display: flex;
  overflow: auto;
}
.gallery__bloc--img {
  flex-grow: 1;
  max-width: 40%;
  height: 100px;
  object-fit: cover;
}
.container_pictures {
  border: 1px solid #00000047;
  border-radius: 15px;
  max-width: 450px;
  max-height: 280px;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 15px;
  padding: 8px;
  position: relative;
  overflow: hidden;
}
.container_pictures--count {
  background-color: rgba(43, 39, 39, 0.781);
  color: rgb(243, 235, 235);
  font-size: 20px;
  font-weight: 400;
  padding: 8px;
  border-radius: 3px;
  position: absolute;
  top: 0;
  right: 0;
}
</style>
