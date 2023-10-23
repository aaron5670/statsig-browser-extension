# Statsig Experimentation - Chrome Extension

With this extension you can test Statsig experiments by injecting custom values
into the LocalStorage of the current page.

![image](https://github.com/aaron5670/statsig-browser-extension/assets/17295145/15e15741-6c07-41eb-aa14-27180f716d24)

Build with [Plasmo](https://docs.plasmo.com/).

## Installation

### Option 1: Chrome Web Store installation

1. Install the Chromium
   extension [here](https://chrome.google.com/webstore/detail/statsig-features-and-expe/doialjibpidkdpdneplcnmkbdojpagdd/).

### Option 2: Manual build and installation

1. Clone this repository locally.
2. Install the dependencies with ``pnpm install``.
3. Create a build with ``pnpm build``.
4. Go in your (Chrome) browser to **chrome://extensions/**, enable **enable Developer Mode** and click on **Load
   unpacked**.
5. Upload the **chrome-mv3-prod** folder you just build.
6. Enjoy! 🙂🧪

### Search for experiments

If you want to use this extension, you need a Statsig Console API Key.
You can create this in the [Statsig console](https://console.statsig.com/api_keys) under **Console API Keys**.


---

## Development

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the Chrome browser,
using manifest v3, use: `build/chrome-mv3-dev`.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

### Load the Extension for Chrome (Chromium)

We plan to automate this in the future, but for the time being, these are the steps you need to take to load your
extension in Chrome.

Head over to `chrome://extensions` and enable Developer Mode.

![](https://docs.plasmo.com/screenshots/developer_mode.png)

Click on "Load Unpacked" and navigate to your extension's `build/chrome-mv3-dev` (or `build/chrome-mv3-prod`) directory.

To see your popup, click on the puzzle piece icon on the Chrome toolbar, and click on your extension.

**Pro-tip:** pin your extension to the Chrome toolbar for easy access by clicking the pin button.

![](https://docs.plasmo.com/screenshots/popup_example.png)
