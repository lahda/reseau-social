<template>
  <v-card
    class="card_search-users"
    elevation="0"
    style="transition: all 0.5s"
    :style="loading ? 'opacity: 0' : 'opacity: 1'"
  >
    <v-list class="card_search-users--title px-1 pt-0">
      <v-list-item-title class="text-h6 grey--text text--darken-1">
        Membres entreprise
      </v-list-item-title>
    </v-list>
    <perfect-scrollbar style="max-height: 550px">
      <v-list class="transparent">
        <v-menu
          v-for="(users, i) in usersList"
          :key="i"
          offset-y
          :close-on-content-click="closeOnMenuClick"
          min-width="310px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-list-item
              :style="users.isConnected ? 'opacity:1' : 'opacity:0.5'"
              v-bind="attrs"
              v-on="on"
              v-show="users.uuid != user.uuid"
              class="card_search-users--list pl-8 rounded-lg"
              style="max-width: 90%"
            >
              <v-badge
                bottom
                :color="users.isConnected ? 'green' : 'transparent'"
                dot
                offset-x="22"
                offset-y="22"
              >
                <v-list-item-avatar class="ml-0" size="36">
                  <img :src="users.avatar || '../avatar.png'" />
                </v-list-item-avatar>
              </v-badge>
              <v-list-item-content style="max-width: 85%">
                <v-list-item-title class="font-weight-medium text-body-1">{{
                  users.firstname + " " + users.lastname
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list>
            <v-list-item link route :to="'/profile/' + users.uuid">
              <v-list-item-avatar>
                <v-icon>mdi-account-circle</v-icon>
              </v-list-item-avatar>
              <v-list-item-title>Voir le profil</v-list-item-title>
            </v-list-item>
            <v-list-item link @click="setUserConv(users)">
              <v-list-item-avatar>
                <v-icon>mdi-facebook-messenger</v-icon>
              </v-list-item-avatar>
              <v-list-item-title>Ouvrir dans le chat</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list>
    </perfect-scrollbar>
  </v-card>
</template>

<script>
import { apiClient } from "../services/ApiClient";
import { mapState, mapMutations } from "vuex";
import { socket } from "../services/Socket";

export default {
  name: "SearchUsers",
  data: () => {
    return {
      loading: false,
      usersList: [],
      closeOnMenuClick: false,
    };
  },
  watch: {
    search(value) {
      if (value == null) value = "";
      this.searchUsers(value);
    },
  },
  mounted() {
    this.searchUsers();
    socket.emit("login", { uuid: this.user.uuid });
    socket.on("logout", (payload) => {
      this.userConnect(payload, false);
    });
    socket.on("login", (payload) => {
      this.userConnect(payload, true);
    });
  },
  computed: {
    ...mapState(["drawerSearch", "user", "search", "messenger"]),
    drawer: {
      get() {
        return this.drawerSearch;
      },
      set(value) {
        this.SET_DRAWER_SEARCH(value);
      },
    },
  },
  methods: {
    ...mapMutations([
      "SET_DRAWER_SEARCH",
      "SET_PRIVATE_CHAT",
      "ADD_PRIVATE_POPUP",
      "SET_DRAWER_CHAT",
      "SELECTED_CHAT",
    ]),
    setUserConv(user) {
      this.SET_PRIVATE_CHAT({ to: user, room: null });
      this.messenger.privateChat.forEach((chat, index) => {
        if (chat.to.uuid == user.uuid) {
          if (this.$vuetify.breakpoint.width < 1100) {
            this.SELECTED_CHAT(index);
            this.SET_DRAWER_CHAT(true);
            return;
          }
          this.ADD_PRIVATE_POPUP(index);
          this.SET_DRAWER_SEARCH(false);
        }
      });
    },
    searchUsers(search = "") {
      this.loading = true;
      apiClient.get(`/user?search=${search}`).then((response) => {
        this.usersList = response.data;
        this.loading = false;
      });
    },
    userConnect(payload, value) {
      this.usersList.forEach((user) => {
        if (user.uuid === payload.uuid) {
          user.isConnected = value;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.v-list-item__icon {
  display: none !important;
}
.card_search-users {
  background-color: transparent !important;
  overflow: hidden;
  min-width: 360px;
}
.card_search-users--title {
  background-color: transparent !important;
  max-width: 250px !important;
}
.users-list--connect {
  filter: grayscale(80%);
}
.users-list--disconnect {
  filter: grayscale(0%);
}
.v-expansion-panel::before {
  box-shadow: none !important;
}
.card_search-users--list {
  cursor: pointer;
  position: relative;
  transition: opacity 0.2s
}
.card_search-users--list:hover {
  background-color: rgba(185, 185, 185, 0.219);
}
</style>
