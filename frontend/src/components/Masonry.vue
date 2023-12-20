<template>
  <vue-masonry-wall :items="items" :options="options">
    <template v-slot:default="{ item, index }">
      <div class="Item">
        <img :src="item.url" @click="galleryFullScreen(index)"/>
      </div>
    </template>
  </vue-masonry-wall>
</template>

<script>
import { mapMutations } from "vuex";
import VueMasonryWall from "vue-masonry-wall";

export default {
  name: "ExampleMasonry",
  props: ["urls"],
  components: { VueMasonryWall },
  data() {
    return {
      options: {
        width: 150,
        padding: {
          default: 1.3,
        },
      },
      items: [],
    };
  },
  mounted() {
    for (let i = 0; i < this.urls.length; i++) {
      this.items.push({ url: this.urls[i] });
    }
  },
  methods: {
    ...mapMutations([
      "SET_DIALOG_GALLERY_FULL",
      "SET_ITEMS_DIALOG",
      "SET_INDEX_DIALOG",
    ]),
    galleryFullScreen(index) {
      this.SET_ITEMS_DIALOG(this.urls);
      this.SET_INDEX_DIALOG(index);
      this.SET_DIALOG_GALLERY_FULL(true);
    },
  },
};
</script>

<style scoped>
.masonry-wall {
  overflow: hidden;
  max-height: 250px;
  border-radius: 8px;
  cursor: pointer;
}
.Item {
  overflow: hidden;
  border-radius: 5px;
  width: 100%;
  background: #f5f5f5;
}
.Content {
  padding: 20px;
}
img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  line-height: 0;
  display: block;
}
</style>
