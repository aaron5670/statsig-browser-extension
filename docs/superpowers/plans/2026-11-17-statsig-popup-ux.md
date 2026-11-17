# Statsig extension UI and UX repair plan

The popup is an operating tool for inspecting Statsig resources and testing website behavior. Keep the Statsig wordmark, resource terminology, console links, and read/write permissions. Use the existing HeroUI components and a restrained visual system with ink text, cool neutral surfaces, and blue for selection and primary actions.

## 1. Popup shell and first run

- [x] Replace the resource selector with visible navigation for Experiments, Dynamic Configs, Feature Gates, and Audit Logs. Keep the remembered view and make the active destination both visible and accessible. Remove the second Audit Logs entry from the settings menu.
- [x] Align the header and content to a shared gutter. Fit the popup at its normal 700px width, at 400px, and at 320px. Keep controls in view when the window is short and when names contain long unbroken keys.
- [x] Configure HeroUI's theme for readable secondary text, quieter borders, compact controls, and visible focus. Keep anchored menus close to their triggers.
- [x] Make the active tab override easy to identify, switch, and clear by keyboard. Update the displayed value after successful browser storage writes and give a useful message when the active tab rejects the operation.
- [x] Make connection setup a single, labelled password form with Enter submission, validation, a recovery link, and feedback for invalid credentials or failed requests. On sign-out, clear cached console data and return to connection setup.

## 2. Resource lists and loading feedback

- [x] Fix experiment name alignment and row actions in screenshot 3. Make names directly focusable and actionable. Use consistent columns, readable status text and dots, clearly labelled menus, and stable left-aligned wrapping for long names.
- [x] Fix screenshot 5's contradictory empty count, spinner, and page number. Distinguish initial loading, filtered empty, unfiltered empty, failed loads, and successful lists. Give a retry or clear-filters action where it helps.
- [x] Apply the same toolbar, column behavior, and pagination to feature gates, dynamic configs, and experiments. Test that search and status combine, filtering moves to a valid page, and optional columns can scroll within the table.

## 3. Resource details and experiment management

- [x] Replace the clipped bottom sheets in screenshots 1, 2, 4, 6, and 7 with a shared dialog. Keep the title and close control visible, scroll the content in one region, wrap names, and verify Escape and focus return.
- [x] Organize experiment groups, applied override, metadata, and hypothesis in task order. Label copying and override actions, distinguish current state from pending work, and preserve the read/write management path.
- [x] Give dynamic config JSON a keyboard-operable, readable viewer. Verify nested values, long strings, and copy behavior inside the popup.
- [x] Keep gate rules, environments, conditions, and pass rate legible with one pass-rate value, consistent semantic colors, and independent error and retry states for rules and overrides.
- [x] Repair experiment management tab selection, names, forms, destructive-action feedback, and close behavior. Exercise both read-only and read/write paths with fixtures.

## 4. Audit logs, user identity, and settings

- [x] In screenshot 8, align audit search and refresh with the other toolbars. Turn entries into clear keyboard-accessible details buttons, use readable action labels, and show when search is limited to loaded entries.
- [x] In screenshot 9, keep the audit feed in place while viewing an entry. Show available context even when there are no rule changes, including one-sided changes. Keep the generic console link in the audit toolbar. Audit entries do not supply a resource URL.
- [x] In screenshot 10, give User Details a single heading and labelled refresh. Distinguish a page without an SDK user from a browser page that cannot be inspected. Keep identifiers readable and give copy feedback.
- [x] In screenshot 11, align labels, help and radio controls. Stage changes until Save, validate the storage key, and ensure Cancel and dismiss leave existing preferences intact. Keep actions reachable in a short popup.

## 5. Verification

- [x] Build and type-check the extension, run the project linter, and inspect the diff for unnecessary dependencies, unreachable UI, and stale styles.
- [x] Render fixtures for all 11 screenshot states. Inspect the 700px popup and check 400px and 320px layouts, short heights, long names, and contrasting states.
- [x] Exercise keyboard navigation, dialog focus entry and return, Escape, list controls, audit drill-down, settings save and cancel, authentication errors, and active-tab override feedback. Use isolated fixture data for console requests and browser storage operations.
- [x] Record verified outcomes and any remaining limits with the final changes.

## Verification record

- TypeScript, Biome, Knip, and `git diff --check` passed. WXT built Chrome and Firefox MV3 packages.
- The unpacked extension passed Chrome fixture checks at 700px, 400px, and 320px. Checks covered valid and invalid credentials, optional first-run settings, list search and pagination, partial failures and retries, dialog names, keyboard focus and escape, narrow overflow, audit rule snapshots, and SDK identity.
- Chrome exercised real clipboard and scripting APIs against an isolated fixture site. It switched storage modes with the same key and applied and cleared both local storage and cookie overrides and verified experiment override creation, deletion, and group renaming against mocked Console responses. The rule meter rendered the full 100% fill immediately.
- Impeccable's engine was unavailable in this environment. The review used the local critique, audit, and refinement references and manual inspection of the rendered states.
- Firefox verification covered packaging. WXT reported the existing Firefox MV3 extension ID and data-collection metadata warnings. Browser interaction checks used fixture data, and the change has not been published.
