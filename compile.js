const path = require("path");
const fs = require("fs");
const solc = require("solc");

const randomSelectorPath = path.resolve(__dirname, "contracts", "randomSelector.sol");
const source = fs.readFileSync(randomSelectorPath, "utf8");

module.exports = solc.compile(source, 1).contracts[":randomSelector"];
