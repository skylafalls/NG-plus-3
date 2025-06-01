import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { resolve } from "path";

function executeCommand(command) {
  return execSync(command).toString().trim();
}

const commit = {
  sha: executeCommand("git rev-parse HEAD"),
  message: executeCommand("git log -1 --pretty=%B"),
  author: executeCommand("git log -1 --pretty=format:%an")
};

const json = JSON.stringify(commit);

writeFileSync(resolve(import.meta.dirname, "../dist/commit.json"), json);
