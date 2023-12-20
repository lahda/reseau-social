<template>
  <v-dialog v-model="dialog">
    <v-carousel
    @keydown.esc="dialog = false"
     class="carousel"
      v-model="currentIndex"
      height="auto"
      hide-delimiters
      show-arrows-on-hover
      progress="true"
    >
    <v-btn fab icon depressed class="close-carousel" @click="dialog = false">
      <v-icon>mdi-close</v-icon>
    </v-btn>  
      <v-carousel-item
      class="carousel_item"
        v-for="(url, i) in items"
        :key="i"
        :src="url"
      >
    </v-carousel-item>
    </v-carousel>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "GalleryFullScreen",
  data() {
    return {};
  },
  updated() {
    this.currentIndex = this.posts.indexDialogGallery;
  },
  computed: {
    ...mapState(["posts"]),
    dialog: {
      get() {
        return this.posts.dialogGalleryFullScreen;
      },
      set(value) {
        this.$store.commit("SET_ITEMS_DIALOG", []);
        this.$store.commit("SET_DIALOG_GALLERY_FULL", value);
      },
    },
    items: {
      get() {
        return this.posts.itemsDialogGallery;
      },
    },
    currentIndex: {
      get() {
        return this.posts.indexDialogGallery;
      },
      set(value) {
        this.$store.commit("SET_INDEX_DIALOG", value);
      },
    },
  }
};
</script>

<style lang="scss">
.v-dialog {
  background-color: gray;
}
.carousel_item{
  max-height: 600px
}
.close-carousel{
  position: absolute;
  top:10px;
  right: 10px;
  z-index: 2
}
.v-image__image--cover {
  background-size: contain !important;
  object-fit: contain;
  max-height: 600px;
}
</style>
