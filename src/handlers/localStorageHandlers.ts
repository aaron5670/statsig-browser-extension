import {deleteCookieValue, deleteLocalStorageValue, getCookieValue, getLocalStorageValue, setCookieValue, setLocalStorageValue} from "~local-storage-injector";

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

// New cookie handlers
export const updateCookieValue = async (tabId: number, cookieKey: string, cookieValue: string) => {
  await chrome.scripting.executeScript(
    {
      args: [cookieKey, cookieValue],
      func: setCookieValue,
      target: {tabId},
      world: "MAIN" // MAIN to access the window object
    }
  );
};

export const removeCookieValue = async (tabId: number, cookieKey: string) => {
  await chrome.scripting.executeScript(
    {
      args: [cookieKey],
      func: deleteCookieValue,
      target: {tabId},
      world: "MAIN" // MAIN in order to access the window object
    }
  );
};

export const getCurrentCookieValue = async (tabId: number, cookieKey: string) => {
  return chrome.scripting.executeScript(
    {
      args: [cookieKey],
      func: getCookieValue,
      target: {tabId},
      world: "MAIN" // MAIN in order to access the window object
    }
  );
};

// Generic handlers that work with both storage types
export const updateStorageValue = async (tabId: number, storageKey: string, storageValue: string, storageType: 'cookie' | 'localStorage') => {
  if (storageType === 'localStorage') {
    return updateLocalStorageValue(tabId, storageKey, storageValue);
  } else {
    return updateCookieValue(tabId, storageKey, storageValue);
  }
};

export const removeStorageValue = async (tabId: number, storageKey: string, storageType: 'cookie' | 'localStorage') => {
  if (storageType === 'localStorage') {
    return removeLocalStorageValue(tabId, storageKey);
  } else {
    return removeCookieValue(tabId, storageKey);
  }
};

export const getCurrentStorageValue = async (tabId: number, storageKey: string, storageType: 'cookie' | 'localStorage') => {
  if (storageType === 'localStorage') {
    return getCurrentLocalStorageValue(tabId, storageKey);
  } else {
    return getCurrentCookieValue(tabId, storageKey);
  }
};
