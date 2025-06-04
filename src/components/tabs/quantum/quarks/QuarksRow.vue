<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    color: {
      type: String,
      required: true,
    },
    effectDisplay: {
      type: String,
      required: true,
    },
    formatFunction: {
      type: Function,
      required: true,
    },
  },
  data: () => ({
    quarkColorAmount: new Decimal(0),
    quarkPower: new Decimal(0),
    powerEffect: new Decimal(0),
    powerGain: new Decimal(0),
  }),
  computed: {
    styling() {
      switch (this.color) {
        case "red": {
          return "quantum-quarks-red";
        }
        case "green": {
          return "quantum-quarks-green";
        }
        case "blue": {
          return "quantum-quarks-blue";
        }
        default: {
          throw new TypeError("Unrecongized quark color");
        }
      }
    },
  },
  methods: {
    update() {
      this.quarkColorAmount.copyFrom(Quarks.amount[this.color]);
      this.quarkPower.copyFrom(Quarks.powers[this.color]);
      this.powerEffect.copyFrom(Quarks.powerEffects[this.color]);
      this.powerGain.copyFrom(Quarks.getGain("powers", this.color));
    },
  },
});
</script>

<template>
  <tr :style="styling">
    <td>
      <span class="quantum-quarks-amount">
        {{ format(quarkColorAmount) }}
      </span>
      {{ color }} quarks
    </td>
    <td>
      <span class="quantum-quarks-power">
        {{ format(quarkPower) }}
      </span>
      {{ color }} power
      <br>
      <span class="quantum-quarks-power-gain">
        {{ format(powerGain) }}
      </span>
    </td>
    <td>
      <span class="quantum-quarks-power-gain">
        {{ formatFunction(powerEffect) }}
      </span>
      {{ effectDisplay }}
    </td>
  </tr>
</template>

<style lang="css" scoped>
.quantum-quarks-red {
  color: #ff0000;
}

.quantum-quarks-green {
  color: #00ff00;
}

.quantum-quarks-blue {
  color: #0000ff;
}

.quantum-quarks-amount {
  font-size: 35px;
}

.quantum-quarks-power {
  font-size: 20px;
}

.quantum-quarks-power-gain {
  font-size: 15px;
}
</style>
