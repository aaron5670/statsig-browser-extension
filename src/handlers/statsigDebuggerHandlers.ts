/**
 * Chrome handler to inject the Statsig debugger input field into the page
 * @param tabId
 */
export const injectStatsigDebugger = async (tabId: number) => {
  console.log("Injecting Statsig debugger");
  return chrome.scripting.executeScript(
    {
      func: openStatsigDebuggerWindow, // function to inject
      target: {tabId},
      world: "MAIN" // MAIN to access the window object
    },
    (injectionResults) => {
      console.log('storage response: ' + injectionResults[0].result);
    });
};

/**
 * Injects the Statsig input field for debugging
 */
export const openStatsigDebuggerWindow = async () => {
  console.log("Open Statsig Debugger Window");

  const theWindow = window as any;

  let instance = theWindow.__STATSIG_JS_SDK__?.instance;
  if (!instance) {
    instance = theWindow.__STATSIG_SDK__?.instance;
  }

  if (!instance) {
    alert("Error: Unable to find Statsig SDK. Please make sure Statsig SDK is loaded on the page.");
  } else {
    const input = document.createElement("input");
    input.value = JSON.stringify({
      sdkKey: instance.sdkKey,
      user: instance.identity.user,
      userValues: instance.store.userValues,
    });
    input.id = "statsig-debugger-data";
    input.type = "hidden";
    document.body.appendChild(input);

    // open new window to show the debugger
    setTimeout(async () => {
      console.log("Extracting and opening debugger");
      const input = document.querySelector("#statsig-debugger-data");
      if (input instanceof HTMLInputElement) {
        const data: {
          sdkKey: string;
          user: Record<string, unknown>;
          userValues: Record<string, unknown>;
        } = JSON.parse(input.value);
        input.remove();

        const debugID = (Math.random() + 1).toString(36).substring(2);

        console.log("Extracted Data", data);
        const url = `https://console.statsig.com/client_sdk_debugger_redirect?sdkKey=${data.sdkKey}&debugID=${debugID}`;

        window
          .open(
            url,
            `statsig-debugger-${debugID}`,
            "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=600"
          )
          ?.focus();
        return;
      }
    }, 100);
  }
};
