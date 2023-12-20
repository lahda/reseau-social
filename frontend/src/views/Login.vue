<template>
  <v-container>
    <v-row style="height: 100vh;">
      <v-col cols="12" class="d-flex flex-column justify-end align-center">
        <v-img
          contain
          src="/icon-above-font-transparent.png"
          max-width="300"
          max-height="150"
        ></v-img>
        <h2 class="mt-3 text-center font-weight-light" style="max-width: 500px">
          Avec Groupomania, partagez et restez en contact avec vos collègues.
        </h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-center">
        <v-flex class="align-self-start" style="max-width: 400px">
          <v-card class="my-5 d-flex flex-column justify-center" :flat="$vuetify.breakpoint.width < 500">
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              class="pa-3 text-center"
            >
              <v-text-field
                style="height: 60px"
                v-model="body.email"
                :rules="emailRules"
                label="Adresse email"
                required
                outlined
                dense
              ></v-text-field>
              <v-text-field
                style="height: 60px"
                v-model="body.password"
                :rules="passwordRules"
                :type="show ? 'text' : 'password'"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show = !show"
                label="Mot de passe"
                outlined
                dense
              ></v-text-field>
              <v-btn
                @click="validate"
                :disabled="!valid"
                depressed
                style="width: 100%"
                class="white--text"
                color="#FD2D01"
              >
                <span v-if="status == 'loading'">
                  <v-progress-circular
                    indeterminate
                    color="white"
                  ></v-progress-circular>
                </span>
                <span v-else>Se connecter</span>
              </v-btn>
            </v-form>
            <router-link to="/" class="mb-3 align-self-center"
              >Mot de passe oublié ?</router-link
            >
            <v-divider></v-divider>
            <Registration @login="loginAfterRegist" />
          </v-card>
        </v-flex>
      </v-col>
    </v-row>
    <SnackBar />
  </v-container>
</template>

<script>
import { apiClient } from '../services/ApiClient'
import { mapState, mapMutations, mapActions } from "vuex";
import Registration from "../components/Registration";
import SnackBar from "../components/SnackBar";

export default {
  name: "Login",
  components: { Registration, SnackBar },
  data: () => {
    return {
      valid: true,
      show: false,
      body: {
        email: "",
        password: "",
      },
      emailRules: [
        (v) => !!v || "Veuillez renseignez votre e-mail",
        (v) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "E-mail non valide",
      ],
      passwordRules: [
        (v) => !!v || "Veuillez renseignez votre mot de passe"
      ]
    };
  },
  computed: {
    ...mapState(["status", "snackbar"]),
  },
  methods: {
    ...mapMutations(["SET_STATUS", "SET_SNACKBAR"]),
    ...mapActions(["loginUser"]),
    validate() {
      const validate = this.$refs.form.validate();
      if (validate) this.login();
    },
    loginAfterRegist(payload) {
      this.body.email = payload.email;
      this.body.password = payload.password;
      this.login();
    },
    login() {
      this.SET_STATUS("loading");
      const body = this.body;
      apiClient.post("/user/login", body)
        .then((user) => {
          this.loginUser(user.data);
          this.SET_STATUS("");
        })
        .catch((e) => {
          this.SET_STATUS(e.response.data.error);
          this.SET_SNACKBAR(true);
        });
    },
  },
};
</script>

<style scoped>
.login {
  width: 400px;
  position: absolute;
  top: 50%;
  transform: translatey(-50%);
}
</style>
