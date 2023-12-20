<template>
  <v-layout justify-center>
    <v-row
      style="max-width: 600px; margin: 0 !important"
      :no-gutters="$vuetify.breakpoint.width < 500"
    >
      <v-col
        cols="12"
        :class="$vuetify.breakpoint.width < 500 ? 'white mt-3' : 'pa-2'"
        v-for="post in posts.posts"
        :key="post.id"
      >
        <Post :post="post" />
      </v-col>
      <v-col cols="12" class="pa-1" v-if="posts.loading">
        <v-skeleton-loader
          elevation="1"
          class="mt-1 rounded-lg"
          type="list-item-avatar, card-heading, image, table-heading"
        ></v-skeleton-loader>
      </v-col>
      <v-col cols="12" class="pa-1" v-if="posts.loading">
        <v-skeleton-loader
          elevation="1"
          class="mt-1 rounded-lg"
          type="list-item-avatar, card-heading, image, table-heading"
        ></v-skeleton-loader>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Post from "../components/Post";

window.addEventListener("load", function () {
  console.log('chargement terminé')
});


export default {
  name: "PostList",
  components: { Post },
  props: ["userUuid"],
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  async mounted() {
    await this.initializePosts(this.userUuid);
  },
  computed: {
    ...mapState(["posts"]),
  },
  methods: {
    ...mapActions(["initializePosts", "morePosts"]),
    ...mapMutations(["LOADING_POST"]),
    handleScroll() {
      const totalHeight = document.documentElement.scrollHeight;
      const scrollHeight = window.scrollY + window.innerHeight;
      const remainingOffset = totalHeight - scrollHeight;

      if (remainingOffset < 3 && !this.posts.lastPage) {
        this.LOADING_POST(true);
        this.morePosts(this.userUuid);
      }
    },
  },
};
</script>
