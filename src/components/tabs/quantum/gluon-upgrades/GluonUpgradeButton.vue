<script>
import CostDisplay from "@/components/CostDisplay.vue";
import DescriptionDisplay from "@/components/DescriptionDisplay.vue";
import EffectDisplay from "@/components/EffectDisplay.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "GluonUpgradeButton",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
  },
  props: {
    upgrade: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isBought: false,
      isAffordable: false,
    };
  },
  computed: {
    classObject() {
      let base = {
        "o-gluon-upgrade": true,
        "o-gluon-upgrade--unavailable": !this.isBought && !this.isAffordable,
      };
      switch (this.type) {
        case "red-green": {
          return {
            ...base,
            "rg-gluon": !this.isBought && this.isAffordable,
            "rg-gluon--bought": this.isBought,
          };
        }
        case "green-blue": {
          return {
            ...base,
            "gb-gluon": !this.isBought && this.isAffordable,
            "gb-gluon--bought": this.isBought,
          };
        }
        case "blue-red": {
          return {
            ...base,
            "br-gluon": !this.isBought && this.isAffordable,
            "br-gluon--bought": this.isBought,
          };
        }
        default: {
          throw new TypeError(`Unknown gluon type: ${this.type}`);
        }
      }
    },
    gluonCurrency() {
      return `${this.type} gluons`;
    },
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought;
      this.isAffordable = upgrade.isAffordable;
    },
  },
});
</script>

<template>
  <button
    :class="classObject"
    @click="upgrade.purchase()"
  >
    <DescriptionDisplay :config="upgrade.config" />
    <EffectDisplay
      br
      :config="upgrade.config"
    />
    <CostDisplay
      v-if="!isBought"
      br
      :config="upgrade.config"
      :name="gluonCurrency"
    />
  </button>
</template>

<style scoped>
.o-gluon-upgrade {
  width: 20rem;
  height: 8rem;
  font-family: Typewriter, serif;
  font-size: 10px;
  font-weight: bold;
  border: 0.1rem solid;
  border-radius: var(--var-border-radius, 0.4rem);
  transition-duration: 0.2s;
  cursor: pointer;
}

.o-gluon-upgrade--unavailable {
  color: white;
  background: #525252;
  border: 0.1rem solid rgb(131, 234, 255);
  cursor: default;
  transition: 200ms;
}

.rg-gluon {
  animation: rgupg 5s infinite;
}

.gb-gluon {
  animation: gbupg 5s infinite;
}

.br-gluon {
  animation: brupg 5s infinite;
}

.rg-gluon:hover {
  animation: rgupghover 5s infinite;
}

.gb-gluon:hover {
  animation: gbupghover 5s infinite;
}

.br-gluon:hover {
  animation: brupghover 5s infinite;
}

.rg-gluon--bought {
  animation: rgupgbought 5s infinite;
  cursor: auto;
}

.gb-gluon--bought {
  animation: gbupgbought 5s infinite;
  cursor: auto;
}

.br-gluon--bought {
  animation: brupgbought 5s infinite;
  cursor: auto;
}

@keyframes rgupg {
  0% {background-color: #1f0000; border: 1px solid #3f0000; box-shadow: inset 0px 0px 5px 0px #7f0000; color: #bf0000}
  25% {background-color: #1f1f00; border: 1px solid #3f3f00; box-shadow: inset 0px 0px 10px 0px #7f7f00; color: #7f7f00}
  50% {background-color: #001f00; border: 1px solid #003f00; box-shadow: inset 0px 0px 20px 0px #007f00; color: #007f00}
  75% {background-color: #1f1f00; border: 1px solid #3f3f00; box-shadow: inset 0px 0px 10px 0px #7f7f00; color: #7f7f00}
  100% {background-color: #1f0000; border: 1px solid #3f0000; box-shadow: inset 0px 0px 5px 0px #7f0000; color: #bf0000}
}

@keyframes gbupg {
  0% {background-color: #001f00; border: 1px solid #003f00; box-shadow: inset 0px 0px 5px 0px #007f00; color: #007f00}
  25% {background-color: #001f1f; border: 1px solid #003f3f; box-shadow: inset 0px 0px 5px 0px #007f7f; color: #007f7f}
  50% {background-color: #00001f; border: 1px solid #00003f; box-shadow: inset 0px 0px 5px 0px #00007f; color: #0000df}
  75% {background-color: #001f1f; border: 1px solid #003f3f; box-shadow: inset 0px 0px 5px 0px #007f7f; color: #007f7f}
  100% {background-color: #001f00; border: 1px solid #003f00; box-shadow: inset 0px 0px 5px 0px #007f00; color: #007f00}
}

@keyframes brupg {
  0% {background-color: #00001f; border: 1px solid #00003f; box-shadow: inset 0px 0px 5px 0px #00007f; color: #0000df}
  25% {background-color: #1f001f; border: 1px solid #3f003f; box-shadow: inset 0px 0px 5px 0px #7f007f; color: #7f007f}
  50% {background-color: #1f0000; border: 1px solid #3f0000; box-shadow: inset 0px 0px 5px 0px #7f0000; color: #bf0000}
  75% {background-color: #1f001f; border: 1px solid #3f003f; box-shadow: inset 0px 0px 5px 0px #7f007f; color: #7f007f}
  100% {background-color: #00001f; border: 1px solid #00003f; box-shadow: inset 0px 0px 5px 0px #00007f; color: #0000df}
}

@keyframes rgupghover {
  0% {background-color: #7f0000; border: 1px solid #3f0000; box-shadow: inset 0px 0px 5px 0px #bf0000; color: #1f0000}
  25% {background-color: #7f7f00; border: 1px solid #3f3f00; box-shadow: inset 0px 0px 10px 0px #bfbf00; color: #1f1f00}
  50% {background-color: #007f00; border: 1px solid #003f00; box-shadow: inset 0px 0px 20px 0px #00bf00; color: #001f00}
  75% {background-color: #7f7f00; border: 1px solid #3f3f00; box-shadow: inset 0px 0px 10px 0px #bfbf00; color: #1f1f00}
  100% {background-color: #7f0000; border: 1px solid #3f0000; box-shadow: inset 0px 0px 5px 0px #bf0000; color: #1f0000}
}
@keyframes gbupghover {
  0% {background-color: #007f00; border: 1px solid #003f00; box-shadow: inset 0px 0px 5px 0px #00bf00; color: #001f00}
  25% {background-color: #007f7f; border: 1px solid #003f3f; box-shadow: inset 0px 0px 5px 0px #00bfbf; color: #001f1f}
  50% {background-color: #00007f; border: 1px solid #00003f; box-shadow: inset 0px 0px 5px 0px #0000bf; color: #00001f}
  75% {background-color: #007f7f; border: 1px solid #003f3f; box-shadow: inset 0px 0px 5px 0px #00bfbf; color: #001f1f}
  100% {background-color: #007f00; border: 1px solid #003f00; box-shadow: inset 0px 0px 5px 0px #00bf00; color: #001f00}
}
@keyframes brupghover {
  0% {background-color: #00007f; border: 1px solid #00003f; box-shadow: inset 0px 0px 5px 0px #0000bf; color: #00001f}
  25% {background-color: #7f007f; border: 1px solid #3f003f; box-shadow: inset 0px 0px 5px 0px #bf00bf; color: #1f001f}
  50% {background-color: #7f0000; border: 1px solid #3f0000; box-shadow: inset 0px 0px 5px 0px #bf0000; color: #1f0000}
  75% {background-color: #7f007f; border: 1px solid #3f003f; box-shadow: inset 0px 0px 5px 0px #bf00bf; color: #1f001f}
  100% {background-color: #00007f; border: 1px solid #00003f; box-shadow: inset 0px 0px 5px 0px #0000bf; color: #00001f}
}

@keyframes rgupgbought {
  0% {background-color: #bf0000; border: 1px solid #7f0000; color: #1f0000}
  25% {background-color: #bfbf00; border: 1px solid #7f7f00; color: #1f1f00}
  50% {background-color: #00bf00; border: 1px solid #007f00; color: #001f00}
  75% {background-color: #bfbf00; border: 1px solid #7f7f00; color: #1f1f00}
  100% {background-color: #bf0000; border: 1px solid #7f0000; color: #1f0000}
}
@keyframes gbupgbought {
  0% {background-color: #00bf00; border: 1px solid #007f00; color: #001f00}
  25% {background-color: #00bfbf; border: 1px solid #007f7f; color: #001f1f}
  50% {background-color: #0000bf; border: 1px solid #00007f; color: #00001f}
  75% {background-color: #00bfbf; border: 1px solid #007f7f; color: #001f1f}
  100% {background-color: #00bf00; border: 1px solid #007f00; color: #001f00}
}
@keyframes brupgbought {
  0% {background-color: #0000bf; border: 1px solid #00007f; color: #00001f}
  25% {background-color: #bf00bf; border: 1px solid #7f007f; color: #1f001f}
  50% {background-color: #bf0000; border: 1px solid #7f0000; color: #1f0000}
  75% {background-color: #bf00bf; border: 1px solid #7f007f; color: #1f001f}
  100% {background-color: #0000bf; border: 1px solid #00007f; color: #00001f}
}

</style>
