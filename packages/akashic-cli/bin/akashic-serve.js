#!/usr/bin/env node

import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("@akashic/akashic-cli-serve/lib/server/").run(process.argv);
