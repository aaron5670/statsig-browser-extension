import { getUserDetailsFromPage } from "~/get-user-details-injector";

export const getUserDetails = async (tabId: number) => {
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: getUserDetailsFromPage,
      world: "MAIN"
    });
    return result?.result ?? null;
  } catch (error) {
    console.error("Failed to get user details from page", error);
    return null;
  }
};
