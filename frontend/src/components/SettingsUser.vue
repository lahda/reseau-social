<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h5">Modifier mes paramètres</span>
        <span class="text-body-2">Ne fonctionne pas</span>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                label="E-mail*"
                v-model="email"
                :rules="emailRules"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <h3>Laissez les champs vide pour rien modifer</h3>
            </v-col>
            <v-col cols="6">
              <v-text-field
                style="height: 40px"
                v-model="passwordActualy"
                :type="show1 ? 'text' : 'password'"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show1 = !show1"
                label="Mot de passe actuel"
                required
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                style="height: 40px"
                v-model="newPassword"
                :rules="newPasswordRules"
                :type="show1 ? 'text' : 'password'"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show1 = !show1"
                label="*Nouveau mot de passe"
                required
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                style="height: 40px"
                v-model="confirmNewPassword"
                :rules="[confirmNewPasswordRules, passwordConfirmationRule]"
                :type="show2 ? 'text' : 'password'"
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show2 = !show2"
                label="*Confirmer"
                required
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <small>*champs obligatoires</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" depressed>
          Désactiver mon compte
        </v-btn>
        <v-btn color="success darken-1" depressed>
          Enregistrer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "SettingsUser",
  data() {
    return {
      show1: false,
      show2: false,
      email: this.$store.state.user.email,
      passwordActualy: "",
      newPassword: "",
      confirmNewPassword: "",
      emailRules: [
        (v) => !!v || "Veuillez renseignez votre e-mail",
        (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "E-mail non valide",
      ],
      newPasswordRules: [
        (v) => !!v || "Veuillez renseignez un mot de passe",
        (v) =>
          /^(?=.*\d).{4,}$/.test(v) ||
          "Doit contenir au moins 4 caractères et 1 chiffre",
      ],
      confirmNewPasswordRules: [
        (v) => !!v || "Veuillez confimez votre mot de passe",
      ],
    };
  },
  computed: {
    ...mapState(["user", "status", "settings"]),
    passwordConfirmationRule() {
      return () =>
        this.newPassword === this.confirmNewPassword ||
        "Les mots de passe ne sont pas identiques";
    },
    dialog: {
      get() {
        return this.settings;
      },
      set(value) {
        this.SET_DRAWER_SETTINGS(value);
      },
    },
  },
  methods: {
    ...mapMutations(["SET_DRAWER_SETTINGS"]),
    // editedProfile: function () {
    //   let body = {
    //     email: this.email,
    //   };
    //   apiClient
    //     .put(`/user/${this.$store.state.user.uuid}`, body)
    //     .then((user) => {
    //       localStorage.setItem("user", JSON.stringify(user.data));
    //       this.$store.state.user = JSON.parse(localStorage.getItem("user"));
    //       this.dialog = false;
    //       this.$emit("reload");
    //     });
    // },
  },
};
</script>
