<template>
  <v-container fluid class="mt-10 pt-0 d-flex justify-center">
    <v-layout justify-center>
      <v-row style="max-width: 600px">
        <v-col cols="12" class="pa-1">
          <Post :post="post" />
        </v-col>
      </v-row>
    </v-layout>
  </v-container>
</template>

<script>
import { apiClient } from "../services/ApiClient";
import Post from "../components/Post";

export default {
  name: "OnePost",
  components: { Post },
  created() {
    apiClient.get(`/post/${this.$route.params.postId}`).then((response) => {
      response.data.content = response.data.content.split(";");
      response.data.content.pop();
      this.post = response.data;
    });
  },
  data() {
    return {
      post: [],
    };
  },
};
</script>
