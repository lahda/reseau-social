<template>
  <v-container
    class="d-flex"
    :class="$vuetify.breakpoint.width > 500 ? 'px-7' : 'pa-0'"
    fluid
  >
    <div class="card_save1 pr-5 d-flex" v-if="$vuetify.breakpoint.width > 1200">
      <SearchUsers :opacity="0.4" />
    </div>
    <v-container
      class="container_posts mt-2 pt-0 d-flex justify-center"
      :class="$vuetify.breakpoint.width < 500 ? 'pa-0' : ''"
    >
      <div class="container_posts-posts">
        <v-layout justify-center>
          <v-row
            style="max-width: 600px; margin: 0 !important"
            :no-gutters="$vuetify.breakpoint.width < 500"
          >
            <v-col
              cols="12"
              :class="$vuetify.breakpoint.width < 500 ? 'white mt-3' : 'pa-2'"
              :style="
                $vuetify.breakpoint.width < 500
                  ? 'padding-top: 10px;margin-top: -14px !important;'
                  : ''
              "
            >
              <ToPost />
              <PostForm />
            </v-col>
          </v-row>
        </v-layout>
        <PostsList />
      </div>
    </v-container>
    <div class="card_save1" v-if="$vuetify.breakpoint.width > 800">
      <DiscussionGlobal :opacity="true" class="card_save2" />
    </div>
  </v-container>
</template>

<script>
import { apiClient } from "../services/ApiClient";
import { mapState, mapActions } from "vuex";
import ToPost from "../components/ToPost";
import PostsList from "../components/PostsList";
import PostForm from "../components/PostForm";
import SearchUsers from "../components/SearchUsers";
import DiscussionGlobal from "../components/DiscussionGlobal";

export default {
  name: "Posts",
  components: { ToPost, PostsList, PostForm, SearchUsers, DiscussionGlobal },
  async mounted() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            "BMdqQbJomMhyKKAj4FefuaE9s9lCyJDiGWftKCXzb1eUgFd4IJOZyLE4ufzdJokjFlG1D0blkKG3IA72ARH8HlQ",
        });
      }
      await apiClient.post("/notification/push", subscription);
    }
  },
  data() {
    return {
      msg: null,
    };
  },
  computed: {
    ...mapState(["user"]),
    ...mapActions(["pushNotifications"]),
  },
};
</script>

<style lang="scss">
.container_posts {
  justify-content: space-between;
}
.container_posts-posts {
  padding: 0 20px;
  width: 100%;
}
@media screen and (max-width: 800px) {
  .container_posts {
    justify-content: center !important;
  }
  .container_posts-posts {
    padding: 0;
  }
}
.card_save1 {
  position: sticky;
  top: 83px;
  max-height: 600px;
  max-width: 360px;
}
.card_save2 {
  border: 1px solid #00000024 !important;
  height: 600px;
  width: 360px;
}
</style>
