import { readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { spawnSync } from "child_process";

const root = process.cwd();
const ignoredDirectories = new Set([
  "node_modules",
  "uploads",
  ".git",
  "migrations",
]);

const files = [];

const walk = (directory) => {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      if (!ignoredDirectories.has(entry)) {
        walk(path);
      }
      continue;
    }

    if (entry.endsWith(".js")) {
      files.push(path);
    }
  }
};

walk(root);

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    console.error(`Syntax check failed: ${relative(root, file)}`);
    process.exit(result.status || 1);
  }
}

console.log(`Syntax checked ${files.length} JavaScript files.`);
