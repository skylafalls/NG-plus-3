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
        "o-electron-upgrade-btn--bought": !this.isUseless && this.isBought,
        "o-electron-upgrade-btn--available": !this.isUseless && !this.isBought && this.canBeBought,
        "o-electron-upgrade-btn--unavailable": !this.isUseless && !this.isBought && !this.canBeBought,
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
  background-color: black;
  font-family: Typewriter, serif;
  font-weight: bold;
  border-color: rgb(0, 132, 255);
  box-shadow: inset 0px 0px 20px 0px rgb(0, 132, 255);
  color: rgb(0, 132, 255);
  height: 90px;
  width: 200px;
}

.o-electron-upgrade-btn:hover {
  color: var(--color-text-inverted);
}

.o-electron-upgrade-btn--bought {
  color: black;
  background-color: rgb(0, 132, 255);
  cursor: default;
}

.o-electron-upgrade-btn--bought:hover {
  color: black;
}

.o-electron-upgrade-btn--available:hover {
  background-color: #3b6ca5;
}

.o-electron-upgrade-btn--unavailable {
  color: black;
  background-color: #f7f7f7;
}

.o-electron-upgrade-btn--unclickable {
  cursor: auto;
}
</style>
