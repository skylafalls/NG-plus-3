<script>
import DescriptionDisplay from "@/components/DescriptionDisplay";
import TimeStudyButton from "./TimeStudyButton";

export default {
  name: "DilationTimeStudy",
  components: {
    DescriptionDisplay,
    TimeStudyButton,
  },
  props: {
    setup: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showRequirement: false,
      maxTT: new Decimal(),
      currTT: new Decimal(),
      ttGen: new Decimal(),
    };
  },
  computed: {
    study() {
      return this.setup.study;
    },
    id() {
      return this.study.id;
    },
    requirement() {
      if (this.id === 1) {
        return `Requirement: ${formatInt(5)} EC11 and EC12 completions
          and ${formatInt(this.maxTT)}/${formatInt(TimeStudy.dilation.totalTimeTheoremRequirement)}
          total Time Theorems`;
      }
      if (this.id === 6) {
        return `Requirement: ${format("1e4000")} Eternity Points`;
      }
      if (this.id === 7) {
        return `Requirement: ${format(1e100)} Time Dilation upgrade`;
      }
      if (this.id === 8) {
        return `Requirement: ${formatInt(5)} EC13 & EC14 completions, ${formatInt(50)} net quarks within your best Quantum`;
      }
      if (this.id === 9) {
        return `Requirement: ${formatInt(16750)} Positrons`;
      }
      if (this.id === 10) {
        return "Requirement: Beat Quantum Challenge 8";
      }
      if (this.id === 11) {
        return "Requirement: Complete Paired Challenge 4";
      }
      return "";
    },
    theoremTimeEstimate() {
      if (this.study.isBought || !this.study.cost || this.ttGen.eq(0)) {
        return null;
      }
      const time = Decimal.sub(this.study.cost, this.currTT).dividedBy(this.ttGen);
      return time.gt(0) ? `Enough TT in ${TimeSpan.fromSeconds(time).toStringShort()}` : null;
    },
  },
  methods: {
    update() {
      if (this.id === 1) {
        this.maxTT.copyFrom(Currency.timeTheorems.max);
        this.showRequirement = !this.study.isBought && !Perk.bypassECDilation.canBeApplied;
      }
      if (this.id === 6) {
        this.showRequirement = !Pelle.isDoomed;
      }
      if (this.id >= 7) {
        this.showRequirement = true;
      }
      this.currTT.copyFrom(Currency.timeTheorems.value);
      this.ttGen.copyFrom(getTTPerSecond().times(getGameSpeedupFactor()));
    },
    clickHandler() {
      switch (this.id) {
        case 1: {
          return () => Tab.eternity.dilation.show();
        }
        case 2:
        case 3:
        case 4:
        case 5: {
          return () => Tab.dimensions.time.show();
        }
        case 6: {
          return () => Tab.dimensions.meta.show();
        }
        default: {
          return () => {};
        }
      }
    },
  },
};
</script>

<template>
  <TimeStudyButton
    :setup="setup"
    :ach-tooltip="theoremTimeEstimate"
    :special-click="clickHandler()"
  >
    <DescriptionDisplay :config="study.config" />
    <template v-if="showRequirement">
      <br>
      <span>{{ requirement }}</span>
    </template>
  </TimeStudyButton>
</template>

<style scoped>

</style>
