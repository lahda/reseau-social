<template>
  <v-card
    elevation="0"
    style="transition: all 0.5s"
    :style="loading ? 'opacity: 0' : ''"
  >
    <div
      style="width: 100%; height: 10%; max-height: 70px"
      class="d-flex align-center justify-space-between px-5"
    >
      <v-btn
        icon
        fab
        color="black"
        @click="goBack"
        v-if="$vuetify.breakpoint.width < 620"
      >
        <v-icon> mdi-arrow-left </v-icon>
      </v-btn>
      <h4 class="d-flex align-center">
        <v-avatar size="40" class="mr-3">
          <v-icon style="font-size: 30px" large>mdi-account-group</v-icon>
        </v-avatar>
        <span>Tout le monde</span>
      </h4>

      <v-btn v-if="isClose" icon @click="setDrawerConv">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <v-divider></v-divider>

    <perfect-scrollbar class="pa-3" v-chat-scroll>
      <v-row>
        <v-col
          cols="12"
          class="bulle_chat d-flex align-center py-0"
          v-for="(message, index) in messages"
          :key="index"
        >
          <v-tooltip left color="black">
            <template v-slot:activator="{ on, attrs }">
              <div
                class="transparent rounded-xl my-1 pa-1 px-3 d-flex"
                v-bind="attrs"
                v-on="on"
                style="max-width: 100%; overflow: hidden"
              >
                <Avatar :avatar="message.user.avatar" size="28" class="mr-2" />
                <div
                  style="max-width: 90%"
                  class="d-flex flex-wrap align-center"
                >
                  <span
                    class="bulle_chat--name grey--text text--darken-1 text-body-2"
                    >{{ `${message.user.firstname} ${message.user.lastname}` }}
                  </span>
                  <span class="ml-1">{{ message.message }}</span>
                </div>
                <v-menu
                  left
                  :close-on-content-click="closeOnMenuClick"
                  min-width="310px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      outlined
                      small
                      v-bind="attrs"
                      v-on="on"
                      class="chat_menu--user"
                    >
                      <v-icon>mdi-dots-horizontal</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-list-item-avatar>
                        <img :src="message.user.avatar || '../avatar.png'" />
                      </v-list-item-avatar>
                      <v-list-item-title class="font-weight-medium">{{
                        `${message.user.firstname} ${message.user.lastname}`
                      }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      link
                      route
                      :to="'/profile/' + message.user.uuid"
                    >
                      <v-list-item-avatar>
                        <v-icon>mdi-account-circle</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-title>Voir le profil</v-list-item-title>
                    </v-list-item>
                    <v-list-item link @click="setUserConv(message.user)">
                      <v-list-item-avatar>
                        <v-icon>mdi-facebook-messenger</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-title>Ouvrir dans le chat</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </template>
            <span>{{ moment(message.createdAt).locale("fr").calendar() }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </perfect-scrollbar>

    <v-divider></v-divider>

    <v-layout
      class="pa-3 d-flex flex-row align-center"
      style="width: 100%; height: 10%; max-height: 70px"
    >
      <v-icon @click="marker = !marker">mdi-emoticon</v-icon>
      <VEmojiPicker
        style="position: absolute; top: 0; left: 0; width: 100%"
        v-if="marker"
        @select="selectEmoji"
      />
      <v-text-field
        placeholder="Ecrire un message ..."
        :append-outer-icon="value ? 'mdi-send' : 'fa-thumbs-up'"
        v-model="value"
        @click:append-outer="sendMessage"
        @keydown.enter="sendMessage"
        class="ml-2"
        filled
        rounded
        dense
        clearable
        hide-details
      ></v-text-field>
    </v-layout>
  </v-card>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Avatar from "./Avatar";
import { socket } from "../services/Socket";
import { apiClient } from "../services/ApiClient";
import { VEmojiPicker } from "v-emoji-picker";

const moment = require("moment");

export default {
  name: "DiscussionGlobal",
  components: { Avatar, VEmojiPicker },
  props: ["isClose"],
  data() {
    return {
      loading: false,
      messages: [],
      value: "",
      moment: moment,
      marker: false,
      closeOnMenuClick: false,
    };
  },
  created() {
    this.loading = true;
    apiClient.get("/chat/").then((messages) => {
      this.messages = messages.data;
      this.loading = false;
    });
  },
  mounted() {
    socket.on("global message", (message) => {
      this.messages.push(message);
    });
  },
  computed: {
    ...mapState(["user", "messenger"]),
  },
  methods: {
    ...mapMutations(["SET_DRAWER_CHAT", "SELECTED_CHAT", "ADD_PRIVATE_POPUP"]),
    goBack() {
      this.$emit("goBack");
    },
    setDrawerConv() {
      this.SET_DRAWER_CHAT(false);
    },
    selectEmoji(emoji) {
      this.value += emoji.data;
    },
    sendMessage() {
      socket.emit("global message", {
        uuid: this.user.uuid,
        message: this.value,
      });
      this.value = "";
    },
    setUserConv(user) {
      this.messenger.privateChat.forEach((chat, index) => {
        if (chat.to.uuid == user.uuid) {
          if (this.$vuetify.breakpoint.width < 1100) {
            this.SELECTED_CHAT(index);
            this.SET_DRAWER_CHAT(true);
            return;
          }
          this.ADD_PRIVATE_POPUP(index);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ps {
  height: 80%;
  max-height: 80vh;
  background-color: #f0f2f59c;
}
.bulle_chat {
  cursor: pointer;
  position: relative;
}
.bulle_chat:hover {
  background-color: rgba(185, 185, 185, 0.219);
}
.chat_menu--user {
  position: absolute;
  top: 50%;
  transform: translatey(-50%);
  right: 20px;
  opacity: 0;
  transition: opacity 0.3s;
}
.bulle_chat:hover .chat_menu--user {
  opacity: 1;
  background-color: white;
}
.bulle_chat--name {
  max-width: 150px;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
