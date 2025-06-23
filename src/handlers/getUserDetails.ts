import {getUserDetailsFromPage} from "~/get-user-details-injector";

export const getUserDetails = async (tabId: number) => {
  try {
    const [result] = await chrome.scripting.executeScript({
      target: {tabId},
      func: getUserDetailsFromPage,
      world: "MAIN",
    });

    if (result && result.result) {
      return result.result as { user: Record<string, any> };
    }
  } catch (e) {
    console.error("Failed to get user details from page", e);
    return null;
  }
  return null;
}; 