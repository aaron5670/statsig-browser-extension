const { heroui } = require("@heroui/theme");

module.exports = {
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        radius: { small: "6px", medium: "8px", large: "12px" },
        borderWidth: { small: "1px", medium: "1px", large: "2px" }
      },
      themes: {
        light: {
          colors: {
            background: "#ffffff",
            content1: "#ffffff",
            content2: "#f6f8fb",
            content3: "#eef2f6",
            divider: "#dbe2ea",
            focus: "#245ccb",
            overlay: "#142033",
            foreground: {
              50: "#f8fafc",
              100: "#eef2f6",
              200: "#dbe2ea",
              300: "#c3cdda",
              400: "#67758a",
              500: "#5a687c",
              600: "#4b596d",
              700: "#37465a",
              800: "#253247",
              900: "#162033",
              DEFAULT: "#162033"
            },
            default: {
              50: "#f6f8fb",
              100: "#eef2f6",
              200: "#dbe2ea",
              300: "#c3cdda",
              400: "#67758a",
              500: "#5a687c",
              foreground: "#162033",
              DEFAULT: "#dbe2ea"
            },
            primary: {
              50: "#edf4ff",
              100: "#dbe8ff",
              600: "#245ccb",
              700: "#1b4ba9",
              900: "#132f69",
              foreground: "#ffffff",
              DEFAULT: "#245ccb"
            },
            danger: { DEFAULT: "#bd233f", foreground: "#ffffff" }
          }
        },
        dark: { colors: { divider: "#3c434d" } }
      }
    })
  ]
};
