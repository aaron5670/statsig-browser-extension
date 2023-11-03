import {deleteLocalStorageValue, getLocalStorageValue, setLocalStorageValue} from "~local-storage-injector";

export const updateLocalStorageValue = async (tabId: number, localStorageKey: string, localStorageValue: string) => {
  await chrome.scripting.executeScript(
    {
      args: [localStorageKey, localStorageValue],
      func: setLocalStorageValue,
      target: {tabId},
      world: "MAIN" // MAIN to access the window object
    }
  );
};

export const removeLocalStorageValue = async (tabId: number, localStorageKey: string) => {
  await chrome.scripting.executeScript(
    {
      args: [localStorageKey],
      func: deleteLocalStorageValue,
      target: {tabId},
      world: "MAIN" // MAIN in order to access the window object
    }
  );
};

export const getCurrentLocalStorageValue = async (tabId: number, localStorageKey: string) => {
  return chrome.scripting.executeScript(
    {
      args: [localStorageKey],
      func: getLocalStorageValue,
      target: {tabId},
      world: "MAIN" // MAIN in order to access the window object
    }
  );
};
