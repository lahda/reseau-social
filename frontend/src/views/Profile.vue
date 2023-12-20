<template>
  <div>
    <v-layout class="white d-flex column align-center mb-3" style="border-bottom: 1px solid rgba(166, 166, 166, 0.67) !important;">
      <v-card v-if="loading" flat class="profil_header">
        <v-skeleton-loader
          class="image_loader"
          width="800px"
          type="image"
        ></v-skeleton-loader>
        <v-skeleton-loader
          class="profil_avatar avatar_loader"
          width="150px"
          type="avatar"
        ></v-skeleton-loader>
      </v-card>
      <v-card v-if="!loading" flat class="profil_header">
        <img
          class="grey lighten-4 rounded-b-lg"
          style="object-fit: unset; max-width: 100%"
          width="800px"
          height="400px"
          :src="profilInfos.couverture || '../Fond-Gris.jpg'"
        />
        <v-avatar class="profil_avatar" height="150" width="150">
          <img :src="profilInfos.avatar || '../avatar.png'" style="object-fit: cover" />
        </v-avatar>
      </v-card>
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center">
            <h1 class="mt-5">
              {{ profilInfos.firstname }} {{ profilInfos.lastname }}
            </h1>
          </v-col>
          <v-col cols="12" class="text-center">
            <h3 class="font-weight-light">{{ profilInfos.bio }}</h3>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="editProfil == true">
        <v-row
          style="border-top: 1px solid rgba(128, 128, 128, 0.3)"
          class="mx-10 pt-4"
          justify="center"
        >
          <EditProfile @reload="getProfile()" />
          <v-btn depressed class="ml-5" @click="openSettings()">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </v-row>
      </v-container>
    </v-layout>
      <PostForm />
      <PostsList :userUuid="this.$route.params.uuid"/>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { apiClient } from "../services/ApiClient";
import EditProfile from "../components/EditProfile";
import PostsList from "../components/PostsList";
import PostForm from "../components/PostForm";

export default {
  name: "Posts",
  components: { EditProfile, PostsList, PostForm },
   watch: {
     async "$route.params.uuid"(value) {
      this.getProfile()
      await this.initializePosts(value);
    }
  },
  mounted() {
    this.getProfile();
  },
  data: function() {
    return {
      profilInfos: {},
      loading: false,
    };
  },
  computed: {
    editProfil() {
      if (this.$store.state.user.uuid == this.$route.params.uuid) {
        return true;
      }
      return false;
    },
  },
  methods: {
    ...mapMutations(["SET_UUID_PROFIL", "SET_DRAWER_SETTINGS"]),
    ...mapActions(["initializePosts"]),
      openSettings(){
      this.SET_DRAWER_SETTINGS(true);
    },
    getProfile: async function() {
      this.loading = true;
      const self = this;
      await apiClient
        .get(`/user/${this.$route.params.uuid}`)
        .then(function(response) {
          self.profilInfos = response.data;
          self.loading = false;
        });
    },
  },
};
</script>

<style>
.profil_header {
  position: relative;
}
.profil_avatar {
  position: absolute !important;
  bottom: -15px;
  left: 50%;
  transform: translatex(-50%);
}
.image_loader > .v-skeleton-loader__image {
  height: 350px;
}
.avatar_loader > .v-skeleton-loader__avatar {
  width: 150px;
  height: 150px;
}
</style>
