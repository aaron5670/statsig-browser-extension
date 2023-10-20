export const setLocalStorageValue = (localStorageKey: string, localStorageValue: string): void => {
  localStorage.setItem(localStorageKey, localStorageValue);
  document.location.reload();
}
