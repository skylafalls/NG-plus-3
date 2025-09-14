import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

function executeCommand(command) {
  return execSync(command).toString().trim();
}

const commit = {
  sha: executeCommand("git rev-parse HEAD"),
  message: executeCommand("git log -1 --pretty=%B"),
  author: executeCommand("git log -1 --pretty=format:%an"),
};

const json = JSON.stringify(commit);

writeFileSync(resolve(import.meta.dirname, "../dist/commit.json"), json);
