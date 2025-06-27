<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "QuantumButton",
  data() {
    return {
      isVisible: false,
      type: QU_BUTTON_DISPLAY_TYPE.FIRST_TIME,
      gainedQK: new Decimal(0),
      currentQK: new Decimal(0),
      currentQKRate: new Decimal(0),
      peakQKRateVal: new Decimal(0),
      peakQKRate: new Decimal(0),
      currentSpaceShards: new Decimal(0),
      gainedSpaceShards: new Decimal(0),
      canReset: false,
      quantumGoal: {
        am: new Decimal(0),
        ma: new Decimal(0),
      },
      hover: false,
      headerTextColored: true,
      creditsClosed: false,
      showQKRate: false,
      isBigRip: false,
    };
  },
  computed: {
    buttonClassObject() {
      return {
        "o-quantum-button": !this.isBigRip,
        "o-quantum-button--big-rip": this.isBigRip,
        "o-quantum-button--unavailable": !this.canReset,
        "o-pelle-disabled-pointer": this.creditsClosed,
      };
    },
    // Show QK/min below this threshold, color the QK number above it (1e40 is roughly when TS181 is attainable)
    rateThreshold: () => 1e33,
    amountStyle() {
      if (!this.headerTextColored || this.currentQK.lt(this.rateThreshold)) {
        return {
          "transition-duration": "0s",
        };
      }
      if (this.hover) {
        return {
          "color": "black",
          "transition-duration": "0.2s",
        };
      }

      // Dynamically generate red-text-green based on the CSS entry for text color, returning a raw 6-digit hex color
      // code. stepRGB is an array specifying the three RGB codes, which are then interpolated between in order to
      // generate the final color; only ratios between 0.9-1.1 give a color gradient
      const textHexCode = getComputedStyle(document.body).getPropertyValue("--color-text").split("#")[1];
      const stepRGB = [
        [255, 0, 0],
        [
          parseInt(textHexCode.slice(0, 2), 16),
          parseInt(textHexCode.slice(2, 4), 16),
          parseInt(textHexCode.slice(4), 16),
        ],
        [0, 255, 0],
      ];
      const ratio = this.gainedQK.max(1).log10().div(this.currentQK.max(1).log10());
      const interFn = (index) => {
        if (ratio.lt(0.9)) {
          return stepRGB[0][index];
        }
        if (ratio.lt(1)) {
          const r = ratio.sub(0.9).mul(10);
          return Decimal.round(new Decimal(1).sub(r).mul(stepRGB[0][index]).add(r.mul(stepRGB[1][index])));
        }
        if (ratio.lt(1.1)) {
          const r = ratio.sub(1).mul(10);
          return Decimal.round(new Decimal(1).sub(r).mul(stepRGB[1][index]).add(r.mul(stepRGB[2][index])));
        }
        return stepRGB[2][index];
      };
      const rgb = [interFn(0), interFn(1), interFn(2)];
      return {
        "color": `rgb(${rgb.join(",")})`,
        "transition-duration": "0.2s",
      };
    },
    tachyonAmountStyle() {
      // Hovering over the button makes all the text on the button black; this text inherits that
      // without us needing to specify a color.
      if (!this.headerTextColored || this.hover) {
        return {
          "transition-duration": "0s",
        };
      }
      let ratio;
      if (this.currentSpaceShards.eq(0)) {
        ratio = this.gainedSpaceShards.eq(0) ? 0 : Infinity;
      } else {
        ratio = this.gainedSpaceShards.div(this.currentSpaceShards).toNumber();
      }

      const rgb = [
        Math.round(Math.clampMax(1 / ratio, 1) * 255),
        Math.round(Math.clampMax(ratio, 1) * 255),
        Math.round(Math.clampMax(ratio, 1 / ratio) * 255),
      ];
      return { color: `rgb(${rgb.join(",")})` };
    },
  },
  methods: {
    update() {
      this.isVisible = Player.canStudyQuantum || PlayerProgress.quantumUnlocked();
      this.isBigRip = player.quantum.bigRip.active;
      if (!this.isVisible) {
        return;
      }
      this.canStudyQuantum = Player.canStudyQuantum;
      this.quantumGoal.am.copyFrom(Player.quantumGoal.am);
      this.quantumGoal.ma.copyFrom(Player.quantumGoal.ma);
      this.headerTextColored = player.options.headerTextColored;
      this.canReset = canPerformQuantumReset() && this.canStudyQuantum;

      if (!this.canReset) {
        this.type = QU_BUTTON_DISPLAY_TYPE.CANNOT_RESET;
        return;
      }

      if (!PlayerProgress.quantumUnlocked()) {
        this.type = QU_BUTTON_DISPLAY_TYPE.FIRST_TIME;
        return;
      }

      if (QuantumChallenge.isRunning) {
        this.type = QU_BUTTON_DISPLAY_TYPE.CHALLENGE;
        return;
      }

      const gainedQK = Quarks.gain;
      this.currentQK.copyFrom(Currency.quarks);
      this.gainedQK.copyFrom(gainedQK);
      if (this.isBigRip) {
        this.type = QU_BUTTON_DISPLAY_TYPE.BIG_RIP;
        this.currentSpaceShards.copyFrom(Currency.spaceShards);
        this.gainedSpaceShards.copyFrom(getSpaceShardGain());
        return;
      }

      this.type = QU_BUTTON_DISPLAY_TYPE.NORMAL;
      this.currentQKRate.copyFrom(gainedQK.dividedBy(
        TimeSpan.fromMilliseconds(player.records.thisQuantum.realTime).totalMinutes));
      this.peakQKRateVal.copyFrom(player.records.thisQuantum.bestQKminVal);
      this.peakQKRate.copyFrom(player.records.thisQuantum.bestQKmin);
      this.showQKRate = this.peakQKRate.lte(this.rateThreshold);
      this.creditsClosed = GameEnd.creditsEverClosed;
    },
  },
});

const QU_BUTTON_DISPLAY_TYPE = {
  CANNOT_RESET: -1,
  FIRST_TIME: 0,
  NORMAL: 1,
  CHALLENGE: 2,
  BIG_RIP: 3,
};
</script>

<template>
  <button
    v-if="isVisible"
    :class="buttonClassObject"
    class="o-prestige-button"
    onclick="requestQuantumReset()"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Cannot Reset -->
    <template v-if="type === -1">
      Reach {{ format(quantumGoal.ma, 2, 2) }}
      <br>
      Meta-Antimatter to study the Quantum layer
    </template>

    <!-- First time -->
    <template v-else-if="type === 0">
      We have enough to reform, we shall study the science of the Quantum layer!
    </template>

    <!-- Normal -->
    <template v-else-if="type === 1">
      <span v-if="showQKRate">Study for </span>
      <span v-else>Study the Quantum layer for </span>
      <span :style="amountStyle">{{ format(gainedQK, 2) }}</span>
      <span v-if="showQKRate"> QK</span>
      <span v-else> {{ pluralize("Quark", gainedQK) }}</span>
      <br>
      <template v-if="showQKRate">
        Current: {{ format(currentQKRate, 2, 2) }} QK/min
        <br>
        Peak: {{ format(peakQKRate, 2, 2) }} QK/min at {{ format(peakQKRateVal, 2, 2) }} QK
      </template>
    </template>

    <!-- Challenge -->
    <template v-else-if="type === 2">
      The unseen has been detected, let's complete this challenging experiment!
    </template>

    <!-- Paired Challenge -->
    <template v-else-if="type === 3">
      The pairing of these seems to be compatiable, let's study more of the combinations.
    </template>

    <!-- Big Rips -->
    <template v-else-if="type === 4">
      Study the cosmological crisis for <span :style="tachyonAmountStyle">{{ format(gainedSpaceShards, 2, 1) }}</span>
      {{ pluralize("Space Shard", gainedSpaceShards) }}
    </template>
  </button>
</template>

<style scoped>
.o-quantum-button {
  font-weight: bold;
  color: var(--color-quantum);
  background-color: var(--color-prestige--accent);
  border-color: var(--color-quantum);
  cursor: pointer;
}

.o-quantum-button:hover {
  color: black;
  background-color: var(--color-quantum);
}

.o-quantum-button span {
  transition-duration: 0.2s;
}

.o-quantum-button:hover span {
  color: black;
}

.o-quantum-button--big-rip {
  font-weight: bold;
  color: var(--color-big-rip);
  background-color: black;
  border-color: var(--color-big-rip);
}

.o-quantum-button--big-rip:hover {
  color: black;
  background-color: var(--color-big-rip);
}

.o-quantum-button--dilation span {
  transition-duration: 0.2s;
}

.o-quantum-button--dilation:hover span {
  color: black;
}

.o-quantum-button--unavailable {
  opacity: 0.5;
  cursor: default;
}
</style>
