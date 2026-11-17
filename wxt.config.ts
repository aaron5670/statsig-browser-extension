import { defineConfig } from "wxt";

import { description, displayName, homepage } from "./package.json";

const icons = {
  16: "icon-16.png",
  48: "icon-48.png",
  96: "icon-96.png",
  128: "icon-128.png"
};

export default defineConfig({
  srcDir: "src",
  outDir: "build",
  modules: ["@wxt-dev/module-react"],
  imports: false,
  manifestVersion: 3,
  webExt: { disabled: true },
  vite: () => ({
    optimizeDeps: { entries: ["src/entrypoints/popup/index.html"] }
  }),
  manifest: {
    name: displayName,
    description,
    homepage_url: homepage,
    action: { default_icon: icons },
    icons,
    permissions: ["scripting"],
    host_permissions: ["http://*/*", "https://*/*"]
  },
  zip: {
    artifactTemplate: "{{browser}}-{{manifestVersion}}-prod.zip",
    excludeSources: ["keys.json"]
  }
});
