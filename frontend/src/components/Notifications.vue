<template>
  <v-menu offset-y>
    <template v-slot:activator="{ attrs, on }">
      <v-badge
        bottom
        :color="!notView ? 'transparent' : 'blue darken-2'"
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
        >
          <v-icon v-if="$vuetify.breakpoint.width < 500" color="black">mdi-bell-outline</v-icon>
          <v-icon v-else color="black">mdi-bell</v-icon>
        </v-btn>
      </v-badge>
    </template>

    <v-card class="pt-5 px-2" max-height="500px" min-width="300px">
      <div class="d-flex align-center justify-space-between">
        <h2 class="px-5">
          Notifications
        </h2>
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
            <v-list-item link @click="markAsRead(null)">
              <v-list-item-title>
                <v-icon left>mdi-check</v-icon>
                Tout marquer comme lu
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <perfect-scrollbar>
        <v-list>
          <v-list-item
            v-for="(notification, index) in notifications"
            :key="index"
            link
            @click="markAsRead(notification.postId)"
            style="width: 300px;"
          >
            <v-list-item-avatar class="ml-0" size="42">
              <img :src="notification.sender.avatar || '../avatar.png'" />
            </v-list-item-avatar>
            <v-list-item-content>
              <p>
                <strong>
                  {{
                    `${notification.sender.firstname} ${notification.sender.lastname}`
                  }}
                </strong>
                à <strong>{{ notification.content }}</strong> votre publication
              </p>
              <span
                class="caption"
                :class="
                  notification.viewed
                    ? ''
                    : 'blue--text text--darken-2 font-weight-medium'
                "
              >
                {{
                  moment(notification.createdAt)
                    .locale("fr")
                    .fromNow()
                }}
              </span>
            </v-list-item-content>
            <v-badge
              bottom
              :color="notification.viewed ? 'transparent' : 'blue darken-2'"
              dot
              offset-x="10"
              offset-y="10"
            >
            </v-badge>
          </v-list-item>
        </v-list>
      </perfect-scrollbar>
    </v-card>
  </v-menu>
</template>

<script>
import { apiClient } from "../services/ApiClient";
const moment = require("moment");

export default {
  name: "Notifications",
  data() {
    return {
      notifications: [],
      notView: false,
      moment: moment,
    };
  },
  created() {
    this.getNotifications();
  },
  computed: {},
  methods: {
    markAsRead(postId) {
      apiClient.post(`/notification`).then(() => {
        if (postId != null) {
          this.$router.push(`/post/${postId}`);
        }
        this.getNotifications();
      });
    },
    getNotifications() {
      apiClient.get(`/notification`).then((response) => {
        this.notifications = response.data;
        this.notView = false;
        for (let i in response.data) {
          if (!response.data[i].viewed) {
            this.notView = true;
            return;
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
.ps {
  max-height: 300px;
}
</style>
