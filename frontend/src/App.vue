<template>
  <v-app>
    <NavBar v-if="route != 'Login'" />
    <v-main
      :style="
        route == 'Login' && $vuetify.breakpoint.width < 500
          ? 'background-color: white'
          : ''
      "
    >
      <router-view />
    </v-main>

    <DiscussionPrivate
      v-for="(popup, index) in messenger.popup"
      :key="index"
      class="private_popup ml-7 rounded-0 rounded-t-lg"
      elevation="4"
      :style="`left:${350 * index}px`"
      :indexChat="popup"
      :to="messenger.privateChat[popup].to"
      :room="messenger.privateChat[popup].room"
      :popup="{ popup, index, elevationCard: '24' }"
      :autofocus="false"
      v-show="$vuetify.breakpoint.width > 1100"
    />

    <GalleryFullScreen />
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import NavBar from "./components/NavBar";
import GalleryFullScreen from "./components/GalleryFullScreen";
import DiscussionPrivate from "./components/DiscussionPrivate";

export default {
  name: "App",
  components: {
    NavBar,
    GalleryFullScreen,
    DiscussionPrivate,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["posts", "messenger"]),
    route() {
      return this.$route.name;
    },
  },
};
</script>

<style>
#app,
body {
  background-color: #f0f2f5;
}
@media screen and (max-width: 500px) {
  #app, body {
    background-color: #bec2c987;
  }
}
a {
  text-decoration: none;
}
.private_popup {
  position: fixed;
  bottom: 0;
  max-height: 445px;
  max-width: 330px;
  transition: 0.3s all;
}
</style>
