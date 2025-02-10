# Statsig Experimentation - Chrome & Firefox Extension

![Statsig Browser Extension](https://github.com/aaron5670/statsig-browser-extension/assets/17295145/2e75d3f1-1ba3-4b07-9146-11c456edd1af)

The Statsig Experimentation Browser Extension is a powerful tool designed for managing and testing Statsig Experiments
directly within your Chromium browser. With a user-friendly interface, it provides a seamless way to search, view, and
handle your experiments without leaving your browser environment.

## Installation

### Option 1: Web Store installation (recommended)

-    [Chrome Web Store](https://chrome.google.com/webstore/detail/statsig-features-and-expe/doialjibpidkdpdneplcnmkbdojpagdd/).
-    [Firefox Addons Store](https://addons.mozilla.org/en-US/firefox/addon/statsig-experimentation/).

### Option 2: Manual build and installation

1. Clone this repository to your local machine.
2. Install the dependencies using `pnpm install`.
3. Build the extension with `pnpm build`.
4. In your Chrome browser, navigate to **chrome://extensions/**, enable **Developer Mode**, and click on **Load unpacked
   **.
5. Upload the **chrome-mv3-prod** folder generated in the build step.
6. Enjoy! 🙂🧪

### Search for experiments

To use this extension, you'll need a Statsig Console API Key, which you can create in
the [Statsig console](https://console.statsig.com/api_keys) under **Console API Keys**.

---

## Development

To run the development server, execute the following command:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For instance, if you're developing for the Chrome browser
using manifest v3, use: `build/chrome-mv3-dev`.

For detailed guidance, refer to our [Documentation](https://docs.plasmo.com/).

## Making production build

Run the following command to create a production bundle for your extension:

```bash
pnpm build
# or
npm run build
```

This will generate a production-ready bundle that can be zipped and published to the stores.

### Load the Extension for Chrome (Chromium)

While we plan to automate this process in the future, follow these steps to load your extension in Chrome:

1. Head over to `chrome://extensions` and enable **Developer Mode**.
   ![Developer Mode](https://docs.plasmo.com/screenshots/developer_mode.png)

2. Click on **Load Unpacked** and navigate to your extension's `build/chrome-mv3-dev` (or `build/chrome-mv3-prod`)
   directory.

3. To view your popup, click on the puzzle piece icon on the Chrome toolbar, and select your extension.
   ![Popup Example](https://docs.plasmo.com/screenshots/popup_example.png)

   **Pro-tip:** Pin your extension to the Chrome toolbar for easy access by clicking the pin button.

## Screenshots

![image](https://github.com/aaron5670/statsig-browser-extension/assets/17295145/a6f89a77-562a-4313-bc1c-bd864cedb66e)
![image](https://github.com/aaron5670/statsig-browser-extension/assets/17295145/ceb10db9-e5d8-49e4-9122-b41ce8c21f97)
![image](https://github.com/aaron5670/statsig-browser-extension/assets/17295145/e772c8df-35e3-4659-b021-3c891f7c1360)
![image](https://github.com/aaron5670/statsig-browser-extension/assets/17295145/266e82c0-dcbd-4072-82d5-2bc4cd478803)
