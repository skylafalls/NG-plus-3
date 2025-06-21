<script>
import PrimaryButton from "@/components/PrimaryButton.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "QuarksRow",
  components: {
    PrimaryButton,
  },
  props: {
    color: {
      type: String,
      required: true,
    },
    effectDisplay: {
      type: String,
      required: true,
    },
    formatType: {
      type: String,
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
      this.quarkColorAmount.copyFrom(Quarks[this.color].amount);
      this.quarkPower.copyFrom(Quarks[this.color].powers);
      this.powerEffect.copyFrom(Quarks[this.color].effect());
      this.powerGain.copyFrom(Quarks[this.color].gain());
    },
    formatFunction(value, precision, precisionUnder1000) {
      switch (this.formatType) {
        case "multiplier": {
          return formatX(value, precision, precisionUnder1000);
        }
        case "percentile": {
          return formatPercents(value.sub(1), precision, precisionUnder1000);
        }
        default: {
          throw new TypeError(`Unknown format type: ${this.formatFunction}`);
        }
      }
    },
    assortQuarks() {
      switch (this.color) {
        case "red": {
          console.log("red");
          break;
        }
        case "green": {
          console.log("green");
          break;
        }
        case "blue": {
          console.log("blue");
          break;
        }
        default: {
          throw new TypeError("Unrecongized quark color");
        }
      }
    },
  },
});
</script>

<template>
  <table>
    <tbody>
      <tr :class="styling">
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
            {{ formatGain(quarkPower, powerGain, 2, 2) }}
          </span>
        </td>
        <td>
          <span class="quantum-quarks-power-gain">
            {{ formatFunction(powerEffect) }}
          </span>
          {{ effectDisplay }}
        </td>
      </tr>
      <tr>
        <td>
          <PrimaryButton @click="assortQuarks">
            Assort
          </PrimaryButton>
          &nbsp;
          <input
            type="number"
            @change.prevent=""
          >
        </td>
      </tr>
    </tbody>
  </table>
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
