const { dirname, resolve } = require("path");
const { readFileSync, writeFileSync } = require("fs");

const package_json = resolve(dirname(__dirname), "package.json");

const package = JSON.parse(readFileSync(package_json, "utf-8"));

package.version = updatePatch(package.version).join(".");

writeFileSync(package_json, JSON.stringify(package, null, 2), "utf-8");

function updatePatch(version) {
  let [major, minor, patch] = version.split(".");
  return [parseInt(major), parseInt(minor), parseInt(patch) + 1];
}
