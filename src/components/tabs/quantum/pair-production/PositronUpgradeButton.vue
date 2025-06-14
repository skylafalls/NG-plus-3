<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PositronUpgradeButton",
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
        "o-positron-upgrade-btn": true,
        "o-positron-upgrade-btn--bought": !this.isUseless && this.isBought,
        "o-positron-upgrade-btn--available": !this.isUseless && !this.isBought && this.canBeBought,
        "o-positron-upgrade-btn--unavailable": !this.isUseless && !this.isBought && !this.canBeBought,
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
      +{{ format(config.multiplierIncrement()) }}x to Positron multiplier ({{ formatInt(upgrade.boughtAmount) }})
    </span>
    <p style="font-size: 10px;">
      Requires: {{ format(upgrade.cost, 2, 2) }} {{ config.currencyDisplay }}
    </p>
    <slot />
  </button>
</template>

<style scoped>
.o-positron-upgrade-btn {
  background-color: black;
  border-color: gold;
  font-family: Typewriter, serif;
  font-weight: bold;
  box-shadow: inset 0px 0px 20px 0px gold;
  color: gold;
  height: 90px;
  width: 200px;
}

.o-positron-upgrade-btn:hover {
  color: var(--color-text-inverted);
}

.o-positron-upgrade-btn--bought {
  color: black;
  background-color: gold;
  cursor: default;
}

.o-positron-upgrade-btn--bought:hover {
  color: black;
}

.o-positron-upgrade-btn--available:hover {
  background-color: #3b6ca5;
}

.o-positron-upgrade-btn--unavailable {
  color: black;
  background-color: #f7f7f7;
}

.o-positron-upgrade-btn--unclickable {
  cursor: auto;
}
</style>
