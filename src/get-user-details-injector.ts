import type { StatsigUser } from "~/types/statsig";

interface LegacyStatsigSdk {
  instance?: { identity?: { user?: StatsigUser } };
}

interface StatsigWindow extends Window {
  __STATSIG_JS_SDK__?: LegacyStatsigSdk;
  __STATSIG_SDK__?: LegacyStatsigSdk;
  __STATSIG__?: {
    instances?: Record<string, unknown>;
    instance?: (key?: string) => { _user?: StatsigUser } | undefined;
  };
}

export const getUserDetailsFromPage = () => {
  const { __STATSIG_JS_SDK__, __STATSIG_SDK__, __STATSIG__ } =
    window as StatsigWindow;
  const legacy = __STATSIG_JS_SDK__?.instance ?? __STATSIG_SDK__?.instance;
  if (legacy) {
    return { user: legacy.identity?.user };
  }

  const keys = Object.keys(__STATSIG__?.instances ?? {});
  if (keys.length === 0) return null;

  const instance =
    keys.length === 1
      ? __STATSIG__?.instance?.()
      : __STATSIG__?.instance?.(keys[0]);
  return instance ? { user: instance._user } : null;
};
