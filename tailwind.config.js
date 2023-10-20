// tailwind.config.js
// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const { nextui } = require("@nextui-org/react");

/**
 * @type {import('postcss').ProcessOptions}
 */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    "./src/**/*.{tsx,jsx,js,ts}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",

  plugins: [nextui()],
  theme: {
    extend: {},
  },
};
