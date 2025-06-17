<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ElectronUpgradeButton",
  props: {
    upgrade: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    canBeBought: false,
    isBought: false,
  }),
  computed: {
    shiftDown() {
      return ui.view.shiftDown;
    },
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "o-electron-upgrade-btn": true,
        "o-electron-upgrade-btn--available": this.canBeBought,
        "o-primary-btn--disabled": !this.canBeBought,
      };
    },
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought || upgrade.isCapped;
      this.canBeBought = upgrade.canBeBought;
    },
  },
});
</script>

<template>
  <button
    :class="classObject"
    @click="upgrade.purchase()"
  >
    <span style="font-size: 11px;">
      +{{ format(config.multiplierIncrement()) }}x to Electron multiplier ({{ formatInt(upgrade.boughtAmount) }})
    </span>
    <p style="font-size: 10px;">
      Requires: {{ format(upgrade.cost, 2, 2) }} {{ config.currencyDisplay }}
    </p>
    <slot />
  </button>
</template>

<style scoped>
.o-electron-upgrade-btn {
  font-family: Typewriter, serif;
  font-weight: bold;
  height: 90px;
  width: 200px;
  color: white;
  border-radius: var(--var-border-radius, 0.5rem);
}

.o-electron-upgrade-btn:hover {
  color: var(--color-text-inverted);
}

.o-electron-upgrade-btn--available {
  background-color: black;
  border-color: rgb(0, 132, 255);
  box-shadow: inset 0px 0px 20px 0px rgb(0, 132, 255);
  color: rgb(0, 132, 255);
  transition: 200ms;
}

.o-electron-upgrade-btn--available:hover {
  background-color: rgb(0, 132, 255);
  box-shadow: none;
  color: white;
}
</style>
