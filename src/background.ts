export {};

console.log("Background script loaded", chrome);

chrome.action.onClicked.addListener((tab) => {
  if (!tab.active || !tab.id) {
    throw new Error("Failed to get active tab ID.");
  }

  chrome.tabs.sendMessage(tab.id, {
    action: "open_debugger",
  });
});
