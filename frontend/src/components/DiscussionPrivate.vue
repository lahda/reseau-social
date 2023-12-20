<template>
  <v-card
    :elevation="popup ? popup.elevationCard : '0'"
    :style="resize ? 'bottom: -400px' : ''"
    style="height: 100%; width: 100%"
  >
    <div
      style="width: 100%; height: 10%; max-height: 70px"
      class="d-flex align-center justify-space-between px-3"
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
      <h4 class="private_title">
        <Avatar :avatar="to.avatar" size="32" class="mr-2" />
        <span class="private_title--name"
          >{{ to.firstname }} {{ to.lastname }}</span
        >
      </h4>

      <v-btn v-if="isClose" icon @click="setDrawerConv" fab>
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <div v-if="popup != undefined">
        <v-btn icon @click="resize = !resize">
          <v-icon v-if="!resize">mdi-window-minimize</v-icon>
          <v-icon v-if="resize">mdi-window-maximize</v-icon>
        </v-btn>
        <v-btn icon @click="windowFullscreen">
          <v-icon>mdi-fullscreen</v-icon>
        </v-btn>
        <v-btn icon @click="setDrawerConv">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>

    <v-divider></v-divider>

    <perfect-scrollbar class="pa-3" v-chat-scroll>
      <v-row>
        <v-col
          cols="12"
          class="bulle_chat d-flex align-center py-0"
          :class="message.user.uuid != user.uuid ? '' : 'flex-row-reverse'"
          v-for="(message, index) in messenger.privateChat[indexChat].messages"
          :key="index"
        >
          <Avatar
            v-if="message.user.uuid != user.uuid"
            :avatar="message.user.avatar"
            :uuid="message.user.uuid"
            size="28"
            class="mr-2"
          />
          <v-tooltip left color="black">
            <template v-slot:activator="{ on, attrs }">
              <div
                class="rounded-xl my-1 pa-1 px-3"
                :class="
                  message.user.uuid == user.uuid
                    ? 'blue lighten-1 white--text'
                    : 'grey lighten-2'
                "
                v-bind="attrs"
                v-on="on"
                :style="
                  message.user.uuid != user.uuid
                    ? 'max-width: 300px'
                    : 'max-width: 340px'
                "
              >
                <p class="mb-0">{{ message.message }}</p>
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
      style="width: 100%; height: 10%"
    >
      <v-icon @click="marker = !marker">mdi-emoticon</v-icon>
      <VEmojiPicker class="emoji" v-if="marker" @select="selectEmoji" />
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
        :autofocus="autofocus"
        @focus="markAsRead()"
      ></v-text-field>
    </v-layout>
  </v-card>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Avatar from "./Avatar";
import { socket } from "../services/Socket";
import { apiClient } from "../services/ApiClient";
import { VEmojiPicker } from "v-emoji-picker";
const moment = require("moment");

export default {
  name: "DiscussionPrivate",
  components: { Avatar, VEmojiPicker },
  props: ["indexChat", "to", "room", "popup", "autofocus", "isClose"],
  data() {
    return {
      value: "",
      marker: false,
      resize: false,
      moment: moment,
    };
  },
  computed: {
    ...mapState(["user", "messenger"]),
  },
  methods: {
    ...mapMutations([
      "SET_ROOM_CHAT",
      "SET_DRAWER_CHAT",
      "SELECTED_CHAT",
      "DELETE_PRIVATE_POPUP",
      "ADD_NEW_MESSAGE",
      "RESET_MESSAGES_VIEWED",
    ]),
    async markAsRead() {
      await apiClient.post(`/chat/room/${this.room}?userUuid=${this.to.uuid}`);
      this.RESET_MESSAGES_VIEWED(this.indexChat);
    },
    windowFullscreen() {
      this.SELECTED_CHAT(this.popup.popup);
      this.SET_DRAWER_CHAT(true);
    },
    goBack() {
      this.$emit("goBack");
    },
    setDrawerConv() {
      if (this.popup != undefined) this.DELETE_PRIVATE_POPUP(this.popup.index);
      this.SET_DRAWER_CHAT(false);
    },
    selectEmoji(emoji) {
      this.value += emoji.data;
    },
    async sendMessage() {
      await socket.emit("private message", {
        sender: this.user.uuid,
        receiver: this.to.uuid,
        message: this.value,
      });
      if (this.room === null) {
        const response = await apiClient.get(`/chat/rooms?to=${this.to.uuid}`);
        this.SET_ROOM_CHAT({ to: this.to, room: response.data[0].id });
      }
      this.ADD_NEW_MESSAGE({
        index: this.indexChat,
        message: { user: this.user, message: this.value },
      });
      this.value = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.ps {
  height: 80%;
  max-height: 80vh;
}
.private_title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
  display: flex;
  align-items: center;
}
.private_title--name {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 150px;
}
.emoji {
  position: absolute;
  top: 0;
  left: 0;
  width: 75%;
  height: 50%;
}
</style>
