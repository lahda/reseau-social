<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn depressed class="mb-5" v-bind="attrs" v-on="on" color="primary">
        <span>Modifier</span>
        <v-icon right>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Edition du profil</span>
      </v-card-title>
      <v-card-text>
        <v-container>

          <v-row>
            <v-col cols="12" md="8">
              <v-img
                class="red lighten-5 rounded-b-lg"
                width="500px"
                height="200px"
                :src="urlCouverture || user.couverture"
              ></v-img>
              <v-file-input
                label="File input"
                hide-input
                prepend-icon="mdi-camera"
                @change="onFileCouverture"
              ></v-file-input>
            </v-col>
            <v-col cols="12" md="4">
              <v-avatar height="150" width="150">
                <img :src="urlAvatar || user.avatar || '../avatar.png'" />
              </v-avatar>
              <v-file-input
                label="File input"
                hide-input
                prepend-icon="mdi-camera"
                @change="onFileAvatar"
              ></v-file-input>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Prénom*"
                v-model="body.firstname"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Nom*"
                v-model="body.lastname"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                filled
                name="input-7-4"
                label="Votre bio"
                v-model="body.bio"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
        <small>*champs obligatoires</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success darken-1" depressed @click="editedProfile">
          Enregistrer
        </v-btn>
        <v-btn color="blue darken-1" text @click="dialog = false">
          Fermer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { apiClient } from "../services/ApiClient";
import { mapState } from "vuex";

export default {
  name: "EditProfile",
  data: function() {
    return {
      dialog: false,
      body: {
        firstname: this.$store.state.user.firstname,
        lastname: this.$store.state.user.lastname,
        bio: this.$store.state.user.bio,
      },
      urlAvatar: null,
      urlCouverture: null,
      fileAvatar: null,
      fileCouverture: null,
      isFormData: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    onFileAvatar: function(event) {
      this.urlAvatar = URL.createObjectURL(event);
      this.fileAvatar = event;
      this.isFormData = true;
    },
    onFileCouverture: function(event) {
      this.urlCouverture = URL.createObjectURL(event);
      this.fileCouverture = event;
      this.isFormData = true;
    },
    editedProfile: function() {
      let body = this.body;

      if (this.isFormData) {
        let formData = new FormData();
        formData.append("avatar", this.fileAvatar || this.user.avatar);
        formData.append(
          "couverture",
          this.fileCouverture || this.user.couverture
        );
        formData.append("user", JSON.stringify(body));
        body = formData;
      }

      apiClient
        .put(`/user/${this.$store.state.user.uuid}`, body)
        .then((user) => {
          localStorage.setItem("user", JSON.stringify(user.data));
          this.$store.state.user = JSON.parse(localStorage.getItem("user"));
          this.dialog = false;
          this.$emit("reload");
        });
    },
  },
};
</script>
