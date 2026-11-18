# Privacy Policy for Statsig Features and Experimentation

This policy describes version 1.18.0 of the Statsig Features and Experimentation browser extension.

## Data the extension uses

- **Statsig Console access.** When you connect a project, the extension saves the Console API key in the extension’s local browser storage. It sends that key over HTTPS to the Statsig Console API (`statsigapi.net`) to authenticate project requests. Console responses can include configurations, experiment assignments, override IDs, and audit entries with account identifiers. When you save or remove a project override or edit an experiment group, the extension sends the relevant IDs and changes to Statsig.
- **Site testing and user details.** The extension reads or writes the test ID in the website cookie or local storage key you configure. The website may receive the cookie or use the ID in its own Statsig requests. When you open User details, the extension displays the identity and attributes available from that site’s Statsig SDK. These can include a user ID, name, email, IP address, country, and custom attributes. The extension processes these details in your browser. Copying a value places it on your system clipboard.
- **Page experiments in Chrome.** The side panel reads the current tab’s address and Statsig experiment evaluations. If you choose Follow my next click, it uses the time of your next click to show which evaluations occurred in the following three seconds. Applying or clearing an override temporarily stores the page address and experiment results in Chrome’s session storage so the extension can compare the two visits. The extension keeps page addresses, click timing, and comparison results in your browser. When you open an experiment’s preview options with a connected key, it sends that experiment’s name to the Statsig Console API to look up its configured overrides.

## Retention and control

Signing out of the extension clears its saved Console API key. Extension preferences and saved test IDs stay in local browser storage until you clear the extension’s data or uninstall it. Closing the tab or ending the Chrome session clears its temporary override comparison. To remove an ID written to a website, use Clear override or clear that website’s data. Changes saved in the Statsig Console remain in your Statsig project until they are changed or removed there.

## Use and sharing

The extension uses this data to inspect, test, and manage Statsig features and experiments. It has no developer-operated collection server and does not send extension usage analytics. The developer does not sell the data or use it for advertising, lending, or unrelated purposes. Use of data received from Google APIs follows the [Chrome Web Store User Data Policy](https://developer.chrome.com/docs/webstore/program-policies/policies), including its Limited Use requirements.

## Contact

For privacy questions, contact Aaron van den Berg at a.vdberg98@gmail.com.
