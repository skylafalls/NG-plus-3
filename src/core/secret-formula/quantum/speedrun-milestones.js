/** @type {import("@/core/quantum/speedrun-milestones").SpeedrunMilestoneParameters[]} */
export const speedrunMilestones = [
  {
    resetWithin: 60 * 60 * 12,
    reward: "Start with 20000 eternities.",
  },
  {
    resetWithin: 60 * 60 * 9,
    reward: "Unlock the Time Theorem autobuyer.",
  },
  {
    resetWithin: 60 * 60 * 6,
    reward: "Start with all Eternity Challenges completed and all Eternity Upgrades bought.",
  },
  {
    resetWithin: 60 * 60 * 4.5,
    reward: "Start with Time Dilation unlocked.",
  },
  {
    resetWithin: 60 * 60 * 3,
    reward: "Unlock the Dilation option for the Auto-Eternity autobuyer (not implemented).",
  },
  {
    resetWithin: 60 * 60 * 2,
    reward: "Keep all non-rebuyable Time Dilation upgrades on Quantum.",
  },
  {
    resetWithin: 60 * 60,
    reward: "Unlock the first Meta Dimension autobuyer and rebuyable Time Dilation upgrades autobuyer.",
  },
  {
    resetWithin: 60 * 60 * (8 / 9),
    reward: "Unlock the second Meta Dimension autobuyer.",
  },
  {
    resetWithin: 60 * 60 * (7 / 9),
    reward: "Unlock the third Meta Dimension autobuyer.",
  },
  {
    resetWithin: 60 * 40,
    reward: "Unlock the fourth Meta Dimension autobuyer.",
  },
  {
    resetWithin: 60 * 60 * (5 / 9),
    reward: "Unlock the fifth Meta Dimension autobuyer and Time Studies don't reset on Quantum resets.",
  },
  {
    resetWithin: 60 * 60 * (4 / 9),
    reward: "Unlock the sixth Meta Dimension autobuyer.",
  },
  {
    resetWithin: 60 * 20,
    reward: "Unlock the seventh Meta Dimension autobuyer.",
  },
  {
    resetWithin: 60 * 60 * (2 / 9),
    reward: "Unlock the eighth Meta Dimension autobuyer.",
  },
  {
    resetWithin: 60 * 60 * (1 / 9),
    reward: "Unlock the Meta-Dimension boost autobuyer.",
  },
  {
    resetWithin: 300,
    reward: "Mastery Studies don't reset on Quantum resets.",
  },
  {
    resetWithin: 240,
    reward: "All Meta Dimensions are available for purchase on Quantum.",
  },
  {
    resetWithin: 210,
    reward: () => `Start with ${format(1e13)} Eternities every Quantum.`,
  },
  {
    resetWithin: 180,
    reward: () => `Start with ${format(5e25)} Meta-Antimatter every Quantum.`,
  },
  {
    resetWithin: 150,
    reward: "Replicanti Galaxies no longer divide your Replicanti amount.",
  },
  {
    resetWithin: 120,
    reward: () => `Meta Dimensions & rebuyable dilation upgrade autobuyers are ${formatX(10)} faster.`,
  },
  {
    resetWithin: 90,
    reward: () => `Start with ${format(1e100)} Dilated Time and they only reset on Quantum resets.`,
  },
  {
    resetWithin: 60,
    reward: "Unlock the Quantum autobuyer (not implemented).",
  },
  {
    resetWithin: 30,
    reward: "Eternities no longer reset your Replicanti.",
  },
  {
    resetWithin: 20,
    reward: "Unlock more options to the Eternity autobuyer (not implemented).",
  },
  {
    resetWithin: 15,
    reward: "The rebuyable Time Dilation upgrade autobuyer can buy the maximum amount.",
  },
  {
    resetWithin: 10,
    reward: "You can buy the maximum amount of Meta-Dimension Boosts and you start with 4 of them.",
  },
  {
    resetWithin: 5,
    reward: "Gain 1% of banked Infinities per second and Big Crunchs don't reset Replicanti Galaxies.",
  },
];
