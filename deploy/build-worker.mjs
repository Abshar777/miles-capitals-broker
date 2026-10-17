// Copies deploy/maintenance.html into the MAINTENANCE_HTML constant of
// deploy/cloudflare-maintenance-worker.js. Run after editing the page:
//   node deploy/build-worker.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(dir, "maintenance.html"), "utf8");
const workerPath = join(dir, "cloudflare-maintenance-worker.js");
const worker = readFileSync(workerPath, "utf8");

const START = "// MAINTENANCE_HTML:START";
const END = "// MAINTENANCE_HTML:END";
const a = worker.indexOf(START);
const b = worker.indexOf(END);
if (a < 0 || b < a) throw new Error("MAINTENANCE_HTML markers not found in the worker file");

const literal = "`" + html.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
writeFileSync(workerPath, `${worker.slice(0, a)}${START}\nconst MAINTENANCE_HTML = ${literal};\n${worker.slice(b)}`);
console.log(`Updated ${workerPath} (${html.length} characters of HTML)`);
