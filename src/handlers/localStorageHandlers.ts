import {setLocalStorageValue } from "~local-storage-injector";

export const updateLocalStorageValue = async (tabId, localStorageKey, localStorageValue) => {
  await chrome.scripting.executeScript(
    {
      args: [localStorageKey, localStorageValue],
      func: setLocalStorageValue,
      target: { tabId },
      world: "MAIN" // MAIN to access the window object
    }
  );
};
