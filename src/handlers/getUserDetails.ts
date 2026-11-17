import { browser } from "wxt/browser";
import { getUserDetailsFromPage } from "~/get-user-details-injector";

export const getUserDetails = async (tabId: number) => {
  const [result] = await browser.scripting.executeScript({
    target: { tabId },
    func: getUserDetailsFromPage,
    world: "MAIN"
  });
  return result?.result ?? null;
};
