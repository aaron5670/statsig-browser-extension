export const setLocalStorageValue = (localStorageKey: string, localStorageValue: string): void => {
  localStorage.setItem(localStorageKey, localStorageValue);
  document.location.reload();
};

export const deleteLocalStorageValue = (localStorageKey: string): void => {
  localStorage.removeItem(localStorageKey);
  document.location.reload();
};

export const getLocalStorageValue = (localStorageKey: string): string => {
  return localStorage.getItem(localStorageKey);
};

// Cookie handling functions
export const setCookieValue = (cookieKey: string, cookieValue: string): void => {
  // Set cookie with path=/ to make it accessible across the entire domain
  // Set max-age to 1 year (31536000 seconds)
  document.cookie = `${cookieKey}=${cookieValue}; path=/; max-age=31536000`;
  document.location.reload();
};

export const deleteCookieValue = (cookieKey: string): void => {
  // Delete cookie by setting max-age to 0
  document.cookie = `${cookieKey}=; path=/; max-age=0`;
  document.location.reload();
};

export const getCookieValue = (cookieKey: string): string => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === cookieKey) {
      return value || '';
    }
  }
  return '';
};
