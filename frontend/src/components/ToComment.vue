<template>
  <div>
    <v-layout class="ma-3">
      <v-row>
        <v-col cols="12" class="d-flex align-center">
          <Avatar :avatar="user.avatar" :uuid="user.uuid" size="36" />
          <v-text-field
            v-model="toComment"
            placeholder="Ecrire un commentaire.."
            autofocus
            @keyup.enter.exact="createComment"
            :id="`input--comment-${postId}`"
            class="ml-2"
            filled
            rounded
            dense
            clearable
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
    </v-layout>
  </div>
</template>

<script>
import { apiClient } from '../services/ApiClient'
import { mapState } from "vuex";
import Avatar from "./Avatar";

export default {
  name: "ToComment",
  components: { Avatar },
  props: {
    postId: Number,
    comments: Array
  },
  data: () => {
    return {
      toComment: "",
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    createComment: function() {
      const body = {
        content: this.toComment,
      };
      this.toComment = "";
      apiClient.post(`/post/comment/${this.postId}`, body).then(() => {
        this.$emit('newComment')
      });
    },
  },
};
</script>
