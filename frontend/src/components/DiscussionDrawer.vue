<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    no-click-animation
    hide-overlay
    content-class="dialog_discussions"
    transition="dialog-bottom-transition"
  >
    <v-card class="d-flex flex-row" style="height: 100%">
      <div
        v-show="$vuetify.breakpoint.width > 620 || messenger.selected == null"
        style="width: 100%"
      >
        <div class="d-flex justify-space-between align-center py-2 px-5">
          <h1 style="height: 10%; max-height: 70px">Discussions</h1>
          <v-btn icon @click="setDrawerConv" fab>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-list>
          <v-list-item
            link
            @click="SELECTED_CHAT(-1)"
            :class="messenger.selected == -1 ? 'blue lighten-5' : ''"
            v-if="$vuetify.breakpoint.width < 1100"
          >
            <v-badge :color="'transparent'" offset-x="25" offset-y="40">
              <v-list-item-avatar size="56">
                <v-icon x-large>mdi-account-group</v-icon>
              </v-list-item-avatar>
            </v-badge>
            <v-list-item-content>
              <v-list-item-title class="text-left">
                Tout le monde
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            link
            @click="SELECTED_CHAT(index)"
            v-for="(chat, index) in messenger.privateChat"
            :key="index"
            :class="messenger.selected == index ? 'blue lighten-5' : ''"
          >
            <v-badge
              :color="chat.notView > 0 ? 'red' : 'transparent'"
              :content="chat.notView"
              offset-x="25"
              offset-y="40"
            >
              <v-list-item-avatar size="56">
                <img :src="chat.to.avatar || '../avatar.png'" />
              </v-list-item-avatar>
            </v-badge>
            <v-list-item-content>
              <v-list-item-title class="text-left">
                {{ chat.to.firstname }}
                {{ chat.to.lastname }}
              </v-list-item-title>
              <v-list-item-subtitle
                v-if="chat.messages[chat.messages.length - 1] != undefined"
                :class="
                  chat.notView > 0
                    ? 'blue--text text--darken-2 font-weight-medium'
                    : ''
                "
              >
                {{
                  chat.messages[chat.messages.length - 1].user.uuid == user.uuid
                    ? "Vous:"
                    : ""
                }}
                {{ chat.messages[chat.messages.length - 1].message }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>

      <div
        style="border-left: 1px solid #80808030; width: 100%"
        class="d-flex"
        v-if="messenger.selected != null"
      >
        <DiscussionPrivate
          class="rounded-0"
          v-for="(chat, index) in messenger.privateChat"
          :key="index"
          v-show="messenger.selected == index"
          :indexChat="index"
          :to="chat.to"
          :room="chat.room"
          @goBack="goBack"
          :autofocus="true"
          :isClose="$vuetify.breakpoint.width < 620 ? true : false"
        />

        <DiscussionGlobal
          style="width: 100%"
          @goBack="goBack"
          :isClose="$vuetify.breakpoint.width < 620 ? true : false"
          v-if="$vuetify.breakpoint.width < 1100"
          v-show="messenger.selected == -1"
        />
      </div>
      <DiscussionGlobal
        v-if="$vuetify.breakpoint.width > 1100"
        style="max-width: 400px; border-left: 1px solid #00000042 !important"
        class="rounded-0"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import DiscussionGlobal from "./DiscussionGlobal";
import DiscussionPrivate from "./DiscussionPrivate";
import { socket } from "../services/Socket";
import { apiClient } from "../services/ApiClient";

export default {
  name: "DiscussionDrawer",
  components: { DiscussionPrivate, DiscussionGlobal },
  data() {
    return {
      selected: 0,
    };
  },
  created() {
    apiClient.get("/chat/rooms").then(async (response) => {
      for (let i in response.data) {
        this.SET_PRIVATE_CHAT({
          to:
            response.data[i].user1.uuid === this.user.uuid
              ? response.data[i].user2
              : response.data[i].user1,
          room: response.data[i].id,
        });
        const messages = await apiClient.get(
          `/chat/room/${response.data[i].id}`
        );
        this.INITIALIZE_MESSAGES({ index: i, messages: messages.data });
      }
    });
  },
  mounted() {
    socket.on("private message", (data) => {
      this.SET_PRIVATE_CHAT({
        to: data.user,
        room: data.roomId,
      });
      this.messenger.privateChat.forEach((chat, index) => {
        if (chat.to.uuid === data.user.uuid) {
          this.ADD_NEW_MESSAGE({
            index,
            message: { user: data.user, message: data.message },
          });
        }
      });
    });
  },
  computed: {
    ...mapState(["user", "messenger"]),
    dialog: {
      get() {
        return this.messenger.drawerConv;
      },
      set(value) {
        this.SET_DRAWER_CHAT(value);
      },
    },
  },
  methods: {
    ...mapMutations([
      "SET_DRAWER_CHAT",
      "SET_PRIVATE_CHAT",
      "SELECTED_CHAT",
      "INITIALIZE_MESSAGES",
      "ADD_NEW_MESSAGE",
    ]),
    goBack() {
      this.SELECTED_CHAT(null);
    },
    setDrawerConv() {
      this.SET_DRAWER_CHAT(false);
    },
  },
};
</script>

<style>
/* .dialog_discussions{
    width: auto!important;
    max-width: 100%!important;
    height: 650px!important;
    margin:0!important;
    overflow: hidden!important;
  } */
</style>
