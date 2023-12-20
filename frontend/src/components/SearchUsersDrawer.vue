<template>
  <v-navigation-drawer v-model="drawer" :width="$vuetify.breakpoint.width < 500 ? '100%' : '370px'" fixed left temporary>
    <div class="d-flex align-center pa-3">
      <v-btn icon @click="goBack" color="black" fab>
        <v-icon>
          mdi-arrow-left
        </v-icon>
      </v-btn>
      <v-text-field
        v-model="setSearch"
        autofocus
        class="search ma-1"
        prepend-inner-icon="mdi-magnify"
        placeholder="Rechercher quelqu'un"
        filled
        rounded
        dense
        clearable
        hide-details
      ></v-text-field>
    </div>
    <v-divider class="my-3"></v-divider>
    <SearchUsers class="pa-3"/>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import SearchUsers from "./SearchUsers.vue";

export default {
  name: "SearchUsersDrawer",
  components: { SearchUsers },
  data: () => {
    return {};
  },
  computed: {
    ...mapState(["drawerSearch", "search"]),
    drawer: {
      get() {
        return this.drawerSearch;
      },
      set(value) {
        this.SET_DRAWER_SEARCH(value);
      },
    },
    setSearch: {
      get() {
        return this.search;
      },
      set(value) {
        this.SET_SEARCH_USER(value);
      },
    },
  },
  methods: {
    ...mapMutations(["SET_DRAWER_SEARCH", "SET_SEARCH_USER"]),
    goBack(){
      this.SET_DRAWER_SEARCH(false);
    }
  },
};
</script>
