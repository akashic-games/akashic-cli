import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-controls",
    "storybook-addon-jsx"
  ],
  core: {
    builder: "@storybook/builder-vite"
  },  
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  staticDirs: ['../www'],
};

export default config;
