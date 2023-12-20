<template>
  <div>
    <v-badge
      v-if="$vuetify.breakpoint.width < 1100"
      bottom
      :color="!messenger.viewed ? 'transparent' : 'red darken-2'"
      dot
      offset-x="45"
      offset-y="35"
    >
      <v-btn
        icon
        class="transparent mx-1 grey lighten-3"
        height="40px"
        width="40px"
        @click="setDrawerConv(); SET_VIEWED()"
      >
        <v-icon v-if="$vuetify.breakpoint.width < 500" color="black">mdi-chat-outline</v-icon>
        <v-icon v-else color="black">mdi-facebook-messenger</v-icon>
      </v-btn>
    </v-badge>
    <v-menu offset-y v-if="$vuetify.breakpoint.width > 1100">
      <template v-slot:activator="{ attrs, on }">
        <v-badge
          bottom
          :color="!messenger.viewed ? 'transparent' : 'red darken-2'"
          dot
          offset-x="45"
          offset-y="35"
        >
          <v-btn
            v-bind="attrs"
            v-on="on"
            icon
            class="mx-1 grey lighten-3"
            height="40px"
            width="40px"
            @click="SET_VIEWED()"
          >
            <v-icon color="black">mdi-facebook-messenger</v-icon>
          </v-btn>
        </v-badge>
      </template>

      <v-card class="pt-5 px-2" max-height="500px" min-width="300px">
        <div class="d-flex align-center justify-space-between">
          <h2 class="px-5">
            Discussions
          </h2>
          <div>
            <v-btn icon @click="setDrawerConv(null)">
              <v-icon>mdi-fullscreen</v-icon>
            </v-btn>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  v-bind="attrs"
                  v-on="on"
                  class="white align-self-center ml-2"
                >
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item link>
                  <v-list-item-title>
                    <v-icon left>mdi-check</v-icon>
                    Tout marquer comme lu
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>

        <perfect-scrollbar v-chat-scroll>
          <v-list>
            <v-list-item
              link
              @click="addPopup(index)"
              v-for="(chat, index) in messenger.privateChat"
              :key="index"
              style="width: 300px;"
            >
              <v-badge
                :color="chat.notView > 0 ? 'red' : 'transparent'"
                :content="chat.notView"
                offset-x="25"
                offset-y="40"
              >
                <v-list-item-avatar class="ml-0" size="42">
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
                  :class="chat.notView > 0 ? 'blue--text text--darken-2 font-weight-medium' : ''"
                >
                  {{
                    chat.messages[chat.messages.length - 1].user.uuid ==
                    user.uuid
                      ? "Vous:"
                      : ""
                  }}
                  {{ chat.messages[chat.messages.length - 1].message }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </perfect-scrollbar>

        <div class="discussion--fullscreen text-center py-2">
          <h4 @click="setDrawerConv">Tout voir en plein ecran</h4>
        </div>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Discussions",
  data() {
    return {};
  },
  computed: {
    ...mapState(["user", "messenger"]),
  },
  methods: {
    ...mapMutations(["SET_DRAWER_CHAT", "ADD_PRIVATE_POPUP", "SET_VIEWED"]),
    addPopup(index) {
      this.ADD_PRIVATE_POPUP(index);
    },
    setDrawerConv() {
      this.SET_DRAWER_CHAT(true);
    },
  },
};
</script>

<style lang="scss">
.discussion--fullscreen {
  border-top: 1px solid rgba(128, 128, 128, 0.37);
  width: 100%;
  background-color: white;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.ps {
  max-height: 300px;
}
</style>
