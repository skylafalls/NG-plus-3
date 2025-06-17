<script>
import { defineComponent } from "vue";
import DilationButton from "./DilationButton";
import DilationUpgradeButton from "./DilationUpgradeButton";

export default defineComponent({
  name: "TimeDilationTab",
  components: {
    DilationButton,
    DilationUpgradeButton,
  },
  data() {
    return {
      tachyons: new Decimal(),
      dilatedTime: new Decimal(),
      dilatedTimeIncome: new Decimal(),
      galaxyThreshold: new Decimal(),
      baseGalaxies: new Decimal(),
      totalGalaxies: new Decimal(),
      tachyonGalaxyGain: new Decimal(),
      hasPelleDilationUpgrades: false,
      galaxyTimeEstimate: "",
      maxDT: new Decimal(),
      toMaxTooltip: "",
      isHovering: false,
    };
  },
  computed: {
    rebuyables() {
      return [
        DilationUpgrade.dtGain,
        DilationUpgrade.galaxyThreshold,
        DilationUpgrade.tachyonGain,
        DilationUpgrade.tachyonExponent,
      ];
    },
    upgrades() {
      return [
        [
          DilationUpgrade.doubleGalaxies,
          DilationUpgrade.tdMultReplicanti,
          DilationUpgrade.ndMultDT,
          DilationUpgrade.dilatedTimeToReplicanti,
        ],
        [
          DilationUpgrade.ipMultDT,
          DilationUpgrade.timeStudySplit,
          DilationUpgrade.dilationPenalty,
          DilationUpgrade.eternitiesDTSynergy,
        ],
        [
          DilationUpgrade.mdMultTickspeed,
          DilationUpgrade.mdBuffDT,
          DilationUpgrade.mdEffectBuff,
          DilationUpgrade.dtMultMA,
        ],
      ];
    },
    dilatedTimeGainText() {
      return formatGain(this.dilatedTime, this.dilatedTimeIncome, 2, 1);
    },
    pelleRebuyables() {
      return [
        DilationUpgrade.dtGainPelle,
        DilationUpgrade.galaxyMultiplier,
        DilationUpgrade.tickspeedPower,
      ];
    },
    pelleUpgrades() {
      return [
        DilationUpgrade.galaxyThresholdPelle,
        DilationUpgrade.flatDilationMult,
      ];
    },
    ttGenerator() {
      return DilationUpgrade.ttGenerator;
    },
    baseGalaxyText() {
      return `${format(this.baseGalaxies, 3)} Base`;
    },
    hasMaxText: () => PlayerProgress.realityUnlocked() && !Pelle.isDoomed,
    allRebuyables() {
      const upgradeRows = [];
      upgradeRows.push(this.rebuyables);
      if (this.hasPelleDilationUpgrades) {
        upgradeRows.push(this.pelleRebuyables);
      }
      return upgradeRows;
    },
    allSingleUpgrades() {
      const upgradeRows = [];
      upgradeRows.push(...this.upgrades);
      if (this.hasPelleDilationUpgrades) {
        upgradeRows.push(this.pelleUpgrades);
      }
      upgradeRows.push([this.ttGenerator]);
      return upgradeRows;
    },
  },
  methods: {
    maxPurchaseDilationUpgrades() {
      maxPurchaseDilationUpgrades();
    },
    update() {
      this.tachyons.copyFrom(Currency.tachyonParticles);
      this.dilatedTime.copyFrom(Currency.dilatedTime);
      const rawDTGain = getDilationGainPerSecond().times(getGameSpeedupForDisplay());
      this.galaxyTimeEstimate = getDilationTimeEstimate(this.galaxyThreshold);
      if (PelleRifts.paradox.isActive) {
        // The number can be small and either positive or negative with the rift active, which means that extra care
        // needs to be taken to get the calculation as close to correct as possible. This relies on some details
        // related to tick microstructure to make things accurate, and it seems to be to roughly 1 part in 5e6
        const tickProp = player.options.updateRate / 1000;
        const drainFactorPerTick = 1 - (1 - Pelle.riftDrainPercent) ** tickProp;
        const drainPerSecond = this.dilatedTime.add(rawDTGain.times(tickProp)).times(drainFactorPerTick / tickProp);
        this.dilatedTimeIncome = rawDTGain.minus(drainPerSecond);
      } else {
        this.dilatedTimeIncome = rawDTGain;
      }
      this.galaxyThreshold.copyFrom(player.dilation.nextThreshold);
      this.baseGalaxies.copyFrom(player.dilation.baseTachyonGalaxies);
      this.totalGalaxies.copyFrom(player.dilation.totalTachyonGalaxies);
      this.hasPelleDilationUpgrades = PelleRifts.paradox.milestones[0].canBeApplied;
      this.tachyonGalaxyGain = Effects.product(
        DilationUpgrade.galaxyMultiplier,
        QuantumChallenge(2).reward,
        DilationUpgrade.doubleGalaxies,
      );
      this.maxDT.copyFrom(player.records.thisReality.maxDT);

      const estimateText = getDilationTimeEstimate(this.maxDT);
      if (this.dilatedTimeIncome.lte(0)) {
        this.toMaxTooltip = "No DT gain";
      } else {
        this.toMaxTooltip = estimateText.startsWith("<") ? "Currently Increasing" : estimateText;
      }
    },
  },
});
</script>

<template>
  <div class="l-dilation-tab">
    <span>
      You have
      <span class="c-dilation-tab__tachyons">{{ format(tachyons, 2, 1) }}</span>
      {{ pluralize("Tachyon Particle", tachyons) }}.
    </span>
    <div
      @mouseover="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <DilationButton />
    </div>
    <span>
      You have
      <span class="c-dilation-tab__dilated-time">{{ format(dilatedTime, 2, 1) }}</span>
      Dilated Time.
      <span class="c-dilation-tab__dilated-time-income">{{ dilatedTimeGainText }}</span>
    </span>
    <span>
      Next
      <span v-if="tachyonGalaxyGain.gt(1)">{{ format(tachyonGalaxyGain, 3, 1) }}</span>
      {{ pluralize("Tachyon Galaxy", tachyonGalaxyGain) }} at
      <span
        class="c-dilation-tab__galaxy-threshold"
        :ach-tooltip="galaxyTimeEstimate"
      >{{ format(galaxyThreshold, 2, 1) }}</span>
      Dilated Time, gained total of
      <span
        class="c-dilation-tab__galaxies"
        :ach-tooltip="baseGalaxyText"
      >{{ format(totalGalaxies, 3, 0) }}</span>
      {{ pluralize("Tachyon Galaxy", totalGalaxies) }}
    </span>
    <span v-if="hasMaxText">
      Your maximum Dilated Time reached this Reality is
      <span
        v-tooltip="toMaxTooltip"
        class="max-accent"
      >{{ format(maxDT, 2, 1) }}</span>.
    </span>
    <button
      class="o-primary-btn l-button-container"
      @click="maxPurchaseDilationUpgrades"
    >
      Max Dilation Upgrades
    </button>
    <div class="l-dilation-upgrades-grid">
      <div
        v-for="(upgradeRow, row) in allRebuyables"
        :key="'rebuyable' + row"
        class="l-dilation-upgrades-grid__row"
      >
        <DilationUpgradeButton
          v-for="upgrade in upgradeRow"
          :key="upgrade.id"
          :upgrade="upgrade"
          :is-rebuyable="true"
          class="l-dilation-upgrades-grid__cell"
          :show-tooltip="isHovering"
        />
      </div>
      <div
        v-for="(upgradeRow, row) in allSingleUpgrades"
        :key="'single' + row"
        class="l-dilation-upgrades-grid__row"
      >
        <DilationUpgradeButton
          v-for="upgrade in upgradeRow"
          :key="upgrade.id"
          :upgrade="upgrade"
          :is-rebuyable="false"
          class="l-dilation-upgrades-grid__cell"
          :show-tooltip="isHovering"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.max-accent {
  color: var(--color-dilation);
  font-size: 1.5rem;
  text-shadow: 0 0 0.2rem var(--color-reality-dark);
  cursor: default;
}

.l-dilation-upgrades-grid {
  display: flex;
  flex-direction: column;
}

.l-dilation-upgrades-grid__row {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.l-dilation-upgrades-grid__cell {
  margin: 1.2rem 1.5rem;
}
</style>
