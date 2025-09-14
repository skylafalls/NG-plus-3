// @ts-check
// Temporarily aggregate tab components here until GameUI is migrated to SFC
import AlchemyTab from "./alchemy/AlchemyTab.vue";
import AntimatterDimensionsTab from "./antimatter-dimensions/AntimatterDimensionsTab.vue";
import AutobuyersTab from "./autobuyers/AutobuyersTab.vue";
import AutomatorTab from "./automator/AutomatorTab.vue";
import BlackHoleTab from "./black-hole/BlackHoleTab.vue";
import BreakInfinityTab from "./break-infinity/BreakInfinityTab.vue";
import CelestialNavigationTab from "./celestial-navigation/CelestialNavigationTab.vue";
import ChallengeRecordsTab from "./challenge-records/ChallengeRecordsTab.vue";
import EffarigTab from "./celestial-effarig/EffarigTab.vue";
import EnslavedTab from "./celestial-enslaved/EnslavedTab.vue";
import EternityChallengesTab from "./eternity-challenges/EternityChallengesTab.vue";
import EternityMilestonesTab from "./eternity-milestones/EternityMilestonesTab.vue";
import EternityUpgradesTab from "./eternity-upgrades/EternityUpgradesTab.vue";
import GlyphSetRecordsTab from "./glyph-set-records/GlyphSetRecordsTab.vue";
import GlyphsTab from "./glyphs/GlyphsTab.vue";
import ImaginaryUpgradesTab from "./imaginary-upgrades/ImaginaryUpgradesTab.vue";
import InfinityChallengesTab from "./infinity-challenges/InfinityChallengesTab.vue";
import InfinityDimensionsTab from "./infinity-dimensions/InfinityDimensionsTab.vue";
import InfinityUpgradesTab from "./infinity-upgrades/InfinityUpgradesTab.vue";
import LaitelaTab from "./celestial-laitela/LaitelaTab.vue";
import MultiplierBreakdownTab from "./statistics/MultiplierBreakdownTab.vue";
import NormalAchievementsTab from "./normal-achievements/NormalAchievementsTab.vue";
import NormalChallengesTab from "./normal-challenges/NormalChallengesTab.vue";
import OptionsGameplayTab from "./options-gameplay/OptionsGameplayTab.vue";
import OptionsSavingTab from "./options-saving/OptionsSavingTab.vue";
import OptionsVisualTab from "./options-visual/OptionsVisualTab.vue";
import PastPrestigeRunsTab from "./past-prestige-runs/PastPrestigeRunsTab.vue";
import PelleTab from "./celestial-pelle/PelleTab.vue";
import PerksTab from "./perks/PerksTab.vue";
import PreviousSpeedrunTab from "./speedrun-milestones/PreviousSpeedrunTab.vue";
import RaTab from "./celestial-ra/RaTab.vue";
import RealityUpgradesTab from "./reality-upgrades/RealityUpgradesTab.vue";
import ReplicantiTab from "./replicanti/ReplicantiTab.vue";
import SecretAchievementTab from "./secret-achievements/SecretAchievementTab.vue";
import ShopTab from "./shop/ShopTab.vue";
import SpeedrunMilestonesTab from "./speedrun-milestones/SpeedrunMilestonesTab.vue";
import StatisticsTab from "./statistics/StatisticsTab.vue";
import TeresaTab from "./celestial-teresa/TeresaTab.vue";
import TimeDilationTab from "./time-dilation/TimeDilationTab.vue";
import TimeDimensionsTab from "./time-dimensions/TimeDimensionsTab.vue";
import TimeStudiesTab from "./time-studies/TimeStudiesTab.vue";
import VTab from "./celestial-v/VTab.vue";

const { default: MetaDimensionsTab } = await import("./meta-dimensions/MetaDimensionsTab.vue");
const { default: MasteryStudiesTab } = await import("./time-studies/MasteryStudiesTab.vue");
const { default: QuarksTab } = await import("./quantum/quarks/QuarksTab.vue");
const { default: PairProductionTab } = await import("./quantum/pair-production/PairProductionTab.vue");
const { default: QuantumChallengesTab } = await import("./quantum/quantum-challenges/QuantumChallengesTab.vue");
const { default: GluonUpgradesTab } = await import("./quantum/gluon-upgrades/GluonUpgradesTab.vue");
const { default: QuantumMilestonesTab } = await import("./quantum/speedrun-milestones/QuantumMilestonesTab.vue");

const TabComponents = {
  AntimatterDimensionsTab,
  InfinityDimensionsTab,
  TimeDimensionsTab,
  OptionsSavingTab,
  OptionsVisualTab,
  OptionsGameplayTab,
  StatisticsTab,
  ChallengeRecordsTab,
  PastPrestigeRunsTab,
  GlyphSetRecordsTab,
  SpeedrunMilestonesTab,
  PreviousSpeedrunTab,
  NormalAchievementsTab,
  SecretAchievementTab,
  TeresaTab,
  EffarigTab,
  EnslavedTab,
  VTab,
  RaTab,
  LaitelaTab,
  PelleTab,
  AutobuyersTab,
  AutomatorTab,
  NormalChallengesTab,
  InfinityChallengesTab,
  EternityChallengesTab,
  InfinityUpgradesTab,
  BreakInfinityTab,
  ReplicantiTab,
  TimeStudiesTab,
  EternityUpgradesTab,
  EternityMilestonesTab,
  TimeDilationTab,
  GlyphsTab,
  RealityUpgradesTab,
  ImaginaryUpgradesTab,
  PerksTab,
  BlackHoleTab,
  AlchemyTab,
  CelestialNavigationTab,
  ShopTab,
  MultiplierBreakdownTab,

  MetaDimensionsTab,
  MasteryStudiesTab,
  QuarksTab,
  PairProductionTab,
  QuantumChallengesTab,
  GluonUpgradesTab,
  QuantumMilestonesTab,
};

export default TabComponents;
