export const getUserDetailsFromPage = () => {
  const theWindow = window as any;

  let isJsMonoClient = false;

  let instance = theWindow.__STATSIG_JS_SDK__?.instance;
  if (!instance) {
    instance = theWindow.__STATSIG_SDK__?.instance;
  }
  if (!instance && theWindow.__STATSIG__?.instances) {
    const instances = theWindow.__STATSIG__?.instances;
    const keys = Object.keys(instances);

    if (keys.length === 1) {
      instance = theWindow.__STATSIG__?.instance();
      isJsMonoClient = true;
    } else if (keys.length > 1) {
      instance = theWindow.__STATSIG__?.instance(keys[0]);
      isJsMonoClient = true;
    }
  }

  if (!instance) {
    return null;
  }

  const user = isJsMonoClient ? instance._user : instance.identity.user;

  return {
    user,
  };
}; 