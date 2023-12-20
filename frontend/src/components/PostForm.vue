<template>
  <v-row justify="center" style="margin: 0!important;">
    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="pa-3 pt-0">
        <v-toolbar height="80" flat color="white">
          <v-toolbar-title class="text-center title" style="width: 100%">
            {{ posts.titleFormPost }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn text @click="closePostDialog" fab>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-title class="my-3 pa-0">
          <Avatar :avatar="user.avatar" :uuid="user.uuid" size="36" />
          <v-layout column class="ml-3">
            <span class="text-body-2 font-weight-medium black--text">
              {{ `${user.firstname} ${user.lastname}` }}
            </span>
          </v-layout>
        </v-card-title>

        <textarea
          v-model="posts.body.title"
          placeholder="Ecrivez quelque chose.."
          class="to_post my-2 white"
          rows="5"
        ></textarea>

        <v-btn
          v-if="posts.urlsContent.length > 0"
          @click="deleteAllFiles"
          small
          depressed
          class="bloc__image--close"
        >
          <v-icon left>mdi-close</v-icon>
          <span>Annuler la sélection</span>
        </v-btn>
        <div v-if="posts.urlsContent.length > 0" class="bloc__image my-3">
          <div class="bloc__image__list d-flex justify-center flex-wrap">
            <div
              v-for="(url, index) in posts.urlsContent"
              :key="url"
              class="bloc__image__img"
            >
              <v-btn
                @click="deleteFile(index)"
                small
                fab
                depressed
                class="bloc__image__img--delete"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <img
                :src="url"
                class="ma-1"
                style="width: 140px; height: 140px; object-fit: cover"
              />
            </div>
          </div>
        </div>

        <div
          class="add_img_post d-flex flex-wrap align-center"
          :class="
            $vuetify.breakpoint.width > 500
              ? 'justify-space-between'
              : 'justify-center'
          "
        >
          <span v-if="$vuetify.breakpoint.width > 500" class=""
            >Ajouter à votre publication</span
          >
          <v-btn
            depressed
            class="my-2 transparent darken-1 gray--text"
            @click="takeContent()"
          >
            <v-icon left>mdi-image</v-icon>
            <span>image / gif</span>
          </v-btn>
        </div>

        <v-file-input
          ref="file"
          style="visibility: hidden; width: 0; position: absolute"
          label="File input"
          hide-input
          multiple
          @change="onFileContent"
        ></v-file-input>

        <v-btn
          style="width: 100%"
          class="success mt-2"
          depressed
          :disabled="isAddButtonDisabled"
          @click="sendPost"
        >
          <span v-if="status == 'loading'">
            <v-progress-circular
              indeterminate
              color="white"
            ></v-progress-circular>
          </span>
          <div v-else>
            <v-icon left>mdi-send</v-icon>
            <span>Publier</span>
          </div>
        </v-btn>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import Avatar from "./Avatar";

export default {
  name: "PostForm",
  components: { Avatar },
  props: ["titleForm"],
  data: () => ({}),
  computed: {
    ...mapState(["user", "status", "posts"]),
    isAddButtonDisabled() {
      return !(this.posts.body.title || this.posts.urlsContent.length > 0);
    },
    dialog: {
      get() {
        return this.posts.dialogFormPost;
      },
      set(value) {
        this.closeDialogPost({ status: null, dialog: value });
      },
    },
  },
  methods: {
    ...mapActions(["deleteOneFile", "sendThePost", "closeDialogPost"]),
    ...mapMutations(["ADD_BODY_FILES", "DELETE_ALL_FILES"]),
    closePostDialog() {
      this.closeDialogPost({ status: null, dialog: false });
    },
    takeContent: function() {
      this.$refs.file.$children[0].$el.click();
    },
    onFileContent(event) {
      this.ADD_BODY_FILES(event);
    },
    deleteFile(index) {
      this.deleteOneFile(index);
    },
    deleteAllFiles() {
      this.DELETE_ALL_FILES();
    },
    sendPost() {
      this.sendThePost();
    },
  },
};
</script>

<style>
@media screen and (max-width: 500px) {
  .v-dialog {
    margin: 0 !important;
  }
}
</style>

<style lang="scss" scoped>
.to_post {
  width: 100%;
  font-size: 20px;
}
.to_post:focus {
  outline: none !important;
}
.add_img_post {
  border: 1px solid rgb(150, 150, 150);
  padding: 2px 15px;
  border-radius: 10px;
}
.bloc__image {
  border: 1px solid rgb(150, 150, 150);
  padding: 5px;
  border-radius: 3px;
  position: relative;
}
.bloc__image__containt {
  max-width: 500px;
}
.bloc__image__img {
  position: relative;
  max-width: 100%;
}
.bloc__image__img--img {
  width: 140px;
  height: 140px;
  object-fit: cover;
}
.bloc__image__img--delete {
  transition: 0.3s;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.bloc__image__img:hover {
  filter: grayscale(80%);
}
.bloc__image__img:hover > .bloc__image__img--delete {
  opacity: 1;
}
</style>
