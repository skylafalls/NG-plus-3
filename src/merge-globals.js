// eslint-disable first
function mergeIntoGlobal(object) {
  for (const key in object) {
    if (key === "default") {
      // Skip default exports
      continue;
    }
    const value = object[key];
    const existingValue = window[key];
    if (existingValue !== undefined) {
      throw new Error(`Property ${key} already exists in global context`);
    }

    console.info(`Merged ${key} into global scope`);

    window[key] = value;
  }
}

import * as Utils from "./core/utils.js";
mergeIntoGlobal(Utils);

// This is a list of legacy stuff, please don't add
// any more globals to the component files

import * as AutomatorBlockEditor from "@/components/tabs/automator/AutomatorBlockEditor.vue";
mergeIntoGlobal(await import("@/components/tabs/automator/AutomatorBlockEditor.vue"));

import * as AutomatorBlocks from "@/components/tabs/automator/AutomatorBlocks.vue";
mergeIntoGlobal(await import("@/components/tabs/automator/AutomatorBlocks.vue"));

import * as AutomatorTextEditor from "@/components/tabs/automator/AutomatorTextEditor.vue";
mergeIntoGlobal(await import("@/components/tabs/automator/AutomatorTextEditor.vue"));

import * as PerksTab from "@/components/tabs/perks/PerksTab.vue";
mergeIntoGlobal(await import("@/components/tabs/perks/PerksTab.vue"));

// End of legacy stuff

import * as GameDB from "./core/secret-formula/index.js";
mergeIntoGlobal(GameDB);

import * as core from "./core/globals.js";
mergeIntoGlobal(core);

import * as game from "./game.js";
mergeIntoGlobal(game);
