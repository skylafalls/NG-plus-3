<script>
import ModalWrapperChoice from "./ModalWrapperChoice.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "NGPlusChoiceModal",
  components: {
    ModalWrapperChoice,
  },
  methods: {
    loadWithNGPlus() {

    },
  },
});
</script>

<template>
  <ModalWrapperChoice
    option="ngPlusMode"
    @confirm="loadWithNGPlus"
  >
    <template #header>
      NG+ Features
    </template>
    <div class="c-modal-message__text">
      You can load this save with NG+ features enabled allowing you to skip most of the pre-NG+3
      boring sections but this will result in spoilers if you haven't played before.
      <br>
      Do you want to enable NG+ mode?
    </div>
    <template #confirm-text>
      Yeah
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-modal__header {
  margin-bottom: 0.5rem;
}
</style>
