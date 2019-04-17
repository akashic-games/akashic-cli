import * as path from "path";

console.log("runSampleContent", path.join(__dirname, "..", "..", "fixtures", "sample_content"));
require(path.join(__dirname, "..", "..", "..", "lib", "server")).run(["node", "index.js", `${path.join(__dirname, "..", "..", "fixtures", "sample_content")}`]);