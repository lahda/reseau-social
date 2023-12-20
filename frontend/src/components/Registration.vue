<template>
  <v-dialog transition="dialog-top-transition" max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        style="max-width: 300px"
        class="my-6 align-self-center"
        color="success"
        large
        dark
        v-bind="attrs"
        v-on="on"
      >
        Créer un compte
      </v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-toolbar height="100" flat color="white" class="px-5 pb-3">
          <v-toolbar-title class="d-flex flex-column align-start display-1">
            S'inscrire
            <span class="text-body-1">C’est rapide et facile.</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog.value = false" fab>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text class="px-5 py-3">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  style="height: 40px"
                  v-model="body.firstname"
                  :rules="firstnameRules"
                  label="Prenom"
                  required
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  style="height: 40px"
                  v-model="body.lastname"
                  :rules="lastnameRules"
                  label="Nom"
                  required
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  style="height: 40px"
                  v-model="body.email"
                  :rules="emailRules"
                  label="Adresse e-mail"
                  required
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  style="height: 40px"
                  v-model="body.password"
                  :rules="passwordRules"
                  :type="show1 ? 'text' : 'password'"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show1 = !show1"
                  label="Mot de passe"
                  required
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  style="height: 40px"
                  v-model="confirmPassword"
                  :rules="[confirmPasswordRules, passwordConfirmationRule]"
                  :type="show2 ? 'text' : 'password'"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show2 = !show2"
                  label="Confirmer"
                  required
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <v-btn
            :disabled="!valid"
            @click="validate"
            style="width: 100%"
            class="title mt-6 align-self-center"
            color="success"
            large
          >
            <span v-if="status == 'loading'">
              <v-progress-circular
                indeterminate
                color="white"
              ></v-progress-circular>
            </span>
            <span v-else>S'inscrire</span>
          </v-btn>
        </v-card-text>
      </v-card>
    </template>
    <SnackBar />
  </v-dialog>
</template>

<script>
import { apiClient } from '../services/ApiClient'
import { mapState, mapMutations } from "vuex";
import SnackBar from "./SnackBar";

export default {
  name: "Registration",
  components: { SnackBar },
  data: () => {
    return {
      valid: true,
      show1: false,
      show2: false,
      body: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      },
      confirmPassword: "",
      firstnameRules: [
        (v) => !!v || "Veuillez renseignez votre prénom",
        (v) => (v && v.length >= 2) || "Doit contenir au moins 2 caractères",
      ],
      lastnameRules: [
        (v) => !!v || "Veuillez renseignez votre nom",
        (v) => (v && v.length >= 2) || "Doit contenir au moins 2 caractères",
      ],
      emailRules: [
        (v) => !!v || "Veuillez renseignez votre e-mail",
        (v) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "E-mail non valide",
      ],
      passwordRules: [
        (v) => !!v || "Veuillez renseignez un mot de passe",
        (v) => /^(?=.*\d).{4,8}$/.test(v) || "Doit contenir 4 à 8 caractères et 1 chiffre",
      ],
      confirmPasswordRules: [
        (v) => !!v || "Veuillez confimez votre mot de passe"
      ],
    };
  },
  computed: {
    ...mapState(["status"]),
    passwordConfirmationRule() {
        return () => (this.body.password === this.confirmPassword) || 'Les mots de passe ne sont pas identiques'
    },
  },
  methods: {
    ...mapMutations(["SET_STATUS", "SET_SNACKBAR"]),
    validate() {
      const validate = this.$refs.form.validate();
      if (validate) this.register();
    },
    register() {
      const body = this.body;
      this.SET_STATUS("loading");
      apiClient.post("/user/register", body)
        .then(() => {
          this.SET_STATUS("");
          this.$emit('login', { email: this.body.email, password: this.body.password })
        })
        .catch((e) => {
          this.SET_STATUS(e.response.data.error);
          this.SET_SNACKBAR(true);
        });
    },
  },
};
</script>

<style>
.v-dialog {
  margin: 0 !important;
}
</style>
