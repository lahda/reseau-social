<template>
  <div>
    <v-layout
      v-if="likesCount > 0 || countAll > 0"
      justify-space-between
      class="mx-3 py-2"
      style="border-bottom: 1px solid rgba(0, 0, 0, 0.2)"
    >
      <div
        v-if="likesCount > 0"
        class="users_likes font-weight-light d-flex align-center text-md-body-1 text-sm-body-1  text-body-2"
        @click="dialog = true"
      >
        <v-icon x-small class="mr-1 icon-like">
          mdi-thumb-up
        </v-icon>
        <p v-if="likesCount === 1 && usersLikes[0] != undefined" class="mb-0">
          {{ usersLikes[0].fullName }}
        </p>
        <p v-else-if="likesCount > 1" class="subheading mr-2 mb-0">
          <span v-if="like">Vous et </span>
          {{ like ? likesCount - 1 : likesCount }} personnes
        </p>
      </div>

      <v-dialog v-model="dialog" max-width="290">
        <v-card>
          <v-list>
            <v-list-item
              v-for="userLike in usersLikes"
              :key="userLike.fullname"
              link
              route
              :to="'/profile/' + userLike.uuid"
            >
              <v-list-item-avatar>
                <img :src="userLike.avatar || '../avatar.png'" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ userLike.fullName }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>

      <div class="font-weight-light">
        <span v-if="countAll > 0" class="mr-1">{{ countAll }}</span>
        <span v-if="countAll > 1" class="subheading">commentaires</span>
        <span v-else-if="countAll == 1" class="subheading">commentaire</span>
      </div>
    </v-layout>
    <div class="mx-3 py-1">
      <v-btn depressed class="white" @click="postLike" style="width: 50%">
        <v-icon class="mr-1" v-if="!like">mdi-thumb-up-outline</v-icon>
        <v-icon class="mr-1" v-else :style="`${like ? 'color: blue' : ''}`"
          >mdi-thumb-up</v-icon
        >
        <span class="mr-2  text-md-body-1 text-sm-body-1  text-body-2" :style="`${like ? 'color: blue' : ''}`">J'aime</span>
      </v-btn>
      <v-btn depressed class="white" @click="focusComment" style="width: 50%">
        <v-icon  class="mr-1">
          mdi-message-outline
        </v-icon>
        <span class="text-md-body-1 text-sm-body-1  text-body-2">Commenter</span>
      </v-btn>
    </div>
    <v-layout
      v-if="comments.length > 0"
      class="mx-3 pt-3 pb-3 d-flex flex-column"
      style="border-top: 1px solid rgba(0, 0, 0, 0.2)"
    >
      <div
        class="comment_link grey--text text--darken-2 text-md-body-1 text-sm-body-1  text-body-2 font-weight-medium"
        v-if="count > 1 && !showAllComments"
        @click="getAllComments"
      >
        <span v-if="count > 2"
          >Afficher {{ count - 1 }} autres commentaires</span
        >
        <span v-else>Afficher {{ count - 1 }} autre commentaire</span>
      </div>
      <div
        class="comment_link grey--text text--darken-2 text-md-body-1 text-sm-body-1 text-body-2 font-weight-medium"
        v-if="count > 1 && showAllComments"
        @click="getOneComment"
      >
        <span>Masquer les commentaires</span>
      </div>
      <v-row class="mt-2" style="max-width: 575px">
        <v-col
          class="d-flex pb-0 pt-1"
          cols="12"
          v-for="comment in comments"
          :key="comment.id"
        >
          <Avatar
            :avatar="comment.user.avatar"
            :uuid="comment.user.uuid"
            size="32"
          />

          <div class="mx-2 d-flex flex-column">
            <div class="d-flex">
              <div class="rounded-lg pa-1 px-3 blue-grey lighten-5">
                <router-link
                  :to="`/profile/${comment.user.uuid}`"
                  class="black--text caption font-weight-bold"
                >
                  {{ `${comment.user.firstname} ${comment.user.lastname}` }}
                </router-link>
                <p class="mb-0 text-body-2 font-weight-regular">
                  {{ comment.content }}
                </p>
              </div>
              <v-menu
                bottom
                right
                v-if="comment.user.uuid === user.uuid || user.isAdmin"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    small
                    v-bind="attrs"
                    v-on="on"
                    class="white align-self-center ml-2"
                  >
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item link>
                    <v-list-item-title>
                      <v-icon small left>mdi-pencil</v-icon>
                      Modifier
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item link @click="deleteComment(comment.id)">
                    <v-list-item-title>
                      <v-icon small left>mdi-delete</v-icon>
                      Supprimer
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <p
              class="text-caption grey--text text--darken-2 ma-0"
            >
              {{
                moment(comment.createdAt)
                  .locale("fr")
                  .fromNow()
              }}
            </p>
          </div>
        </v-col>
      </v-row>
    </v-layout>
    <ToComment v-if="toComment" :postId="postId" @newComment="addComment" />
  </div>
</template>

<script>
import { apiClient } from "../services/ApiClient";
import { mapState } from "vuex";
import Avatar from "./Avatar";
import ToComment from "./ToComment";

const moment = require("moment");

export default {
  name: "Comment",
  components: { Avatar, ToComment },
  props: ["postId", "likes"],
  data() {
    return {
      dialog: false,
      moment: moment,
      comments: [],
      showAllComments: false,
      toComment: false,
      countAll: null,
      count: null,
      likesCount: null,
      like: false,
      usersLikes: [],
    };
  },
  mounted() {
    this.getOneComment();
    this.getLike();
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    focusComment() {
      this.toComment = !this.toComment;
      const input = document.getElementById(`input--comment-${this.postId}`);
      if (input != null) input.focus();
    },
    getOneComment() {
      apiClient.get(`/post/comment/${this.postId}/?limit=1`).then((response) => {
        this.comments = response.data.rows;
        this.countAll = response.data.count;
        this.count = this.countAll;
        this.showAllComments = false;
      });
    },
    getAllComments() {
      apiClient.get(`/post/comment/${this.postId}`).then((response) => {
        this.comments = response.data.rows;
        this.showAllComments = true;
      });
    },
    addComment() {
      this.getOneComment();
    },
    modifyComment() {},
    deleteComment(commentId) {
      apiClient.delete(`/post/comment/${commentId}`).then(() => {
        this.getOneComment();
      });
    },
    getLike() {
      apiClient.get(`/post/likes/${this.postId}`).then((response) => {
        for (const i of Object.keys(response.data)) {
          this.likesCount++;
          this.usersLikes.push({
            uuid: response.data[i].user.uuid,
            fullName: `${response.data[i].user.firstname} ${response.data[i].user.lastname}`,
            avatar: response.data[i].user.avatar,
          });
          if (response.data[i].user.uuid === this.user.uuid) {
            this.like = true;
          }
        }
      });
    },
    postLike() {
      apiClient.post(`/post/like/${this.postId}`).then((response) => {
        if (response.data.like == false) {
          this.usersLikes.forEach((user, index) => {
            if (user.uuid === this.user.uuid) this.usersLikes.splice(index, 1);
          });
          this.like = false;
          this.likesCount--;
        } else {
          this.usersLikes.push({
            uuid: response.data.uuid,
            fullName: `${response.data.firstname} ${response.data.lastname}`,
            avatar: response.data.avatar,
          });
          this.like = true;
          this.likesCount++;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-like {
  font-size: 15px !important;
  border-radius: 50px;
  background-color: blue;
  color: white;
  padding: 5px;
}
.comment_link {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.users_likes {
  cursor: pointer;
}
.users_likes p:hover {
  text-decoration: underline;
}
</style>
