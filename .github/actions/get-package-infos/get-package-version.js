const core = require("@actions/core");
const path = require("path");
const fs = require("fs");
const pkg = require("../../../package.json");

try {
  core.setOutput("pkgVersion", pkg.version);
  core.setOutput("pkgName", pkg.name);
} catch (error) {
  core.setFailed(error.message);
}
