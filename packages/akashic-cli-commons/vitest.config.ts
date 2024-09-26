import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		include: [
			"./src/**/__tests__/**/*[sS]pec.ts",
			"./src/**/__tests__/**/*[sS]pec_invalid.ts",
		]
	},
});
