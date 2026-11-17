import { readFile } from "node:fs/promises";
import { setTimeout } from "node:timers/promises";
import packageJson from "../../package.json" with { type: "json" };

async function requestJson(step, url, options) {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(30_000)
  }).catch((error) => {
    throw new Error(`${step} failed: ${error.message}`);
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    const detail = data?.error?.message ?? data?.error ?? response.statusText;
    throw new Error(`${step} failed (HTTP ${response.status}): ${detail}`);
  }
  return data;
}

const artifact = process.argv[2];
const statusOnly = artifact === "--status-only";
const { version } = packageJson;
const publisherId = process.env.CHROME_PUBLISHER_ID;
let chrome;
try {
  chrome = JSON.parse(process.env.SUBMIT_KEYS || "{}")?.chrome;
} catch {
  throw new Error("SUBMIT_KEYS must contain valid JSON.");
}
if (
  !artifact ||
  !publisherId ||
  !/^[a-p]{32}$/.test(chrome?.extId ?? "") ||
  !chrome.clientId ||
  !chrome.clientSecret ||
  !chrome.refreshToken
) {
  throw new Error("Expected a Chrome ZIP or --status-only, CHROME_PUBLISHER_ID, and Chrome OAuth credentials in SUBMIT_KEYS.");
}

const { access_token: accessToken } = await requestJson(
  "Chrome OAuth token exchange",
  "https://oauth2.googleapis.com/token",
  {
    method: "POST",
    body: new URLSearchParams({
      client_id: chrome.clientId,
      client_secret: chrome.clientSecret,
      refresh_token: chrome.refreshToken,
      grant_type: "refresh_token"
    })
  }
);
if (!accessToken) {
  throw new Error("Chrome OAuth token exchange returned no access token.");
}

const api = "https://chromewebstore.googleapis.com";
const item = `publishers/${encodeURIComponent(publisherId)}/items/${chrome.extId}`;
const headers = { Authorization: `Bearer ${accessToken}` };
const fetchStatus = () => requestJson("Chrome item status", `${api}/v2/${item}:fetchStatus`, { headers });
const status = await fetchStatus();

if (statusOnly) {
  console.log("Chrome Web Store access verified.");
} else {
  const revisions = [status.publishedItemRevisionStatus, status.submittedItemRevisionStatus];
  for (const revision of revisions) {
    const state = revision?.state;
    if (!["PUBLISHED", "PENDING_REVIEW", "STAGED"].includes(state)) continue;
    if (revision.distributionChannels?.some((channel) => channel.crxVersion === version)) {
      console.log(`Chrome ${version} is already ${state}.`);
      process.exit(0);
    }
    if (state !== "PUBLISHED") {
      throw new Error(`Chrome already has another version in state ${state}. Check the Developer Dashboard.`);
    }
  }

  const upload = await requestJson("Chrome package upload", `${api}/upload/v2/${item}:upload`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/zip" },
    body: await readFile(artifact)
  });
  if (upload.crxVersion && upload.crxVersion !== version) {
    throw new Error(`Chrome received version ${upload.crxVersion}, expected ${version}.`);
  }

  let uploadState = upload.uploadState;
  for (let attempt = 0; uploadState === "IN_PROGRESS" && attempt < 30; attempt++) {
    await setTimeout(10_000);
    uploadState = (await fetchStatus()).lastAsyncUploadState;
  }
  if (uploadState !== "SUCCEEDED") {
    throw new Error(`Chrome upload ended in state ${uploadState}. Check the Developer Dashboard.`);
  }

  const submission = await requestJson("Chrome review submission", `${api}/v2/${item}:publish`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: "{}"
  });
  if (!["PENDING_REVIEW", "PUBLISHED", "PUBLISHED_TO_TESTERS", "STAGED"].includes(submission.state)) {
    throw new Error(`Chrome submission returned state ${submission.state}. Check the Developer Dashboard.`);
  }
  console.log(`Chrome ${version} submission: ${submission.state}`);
}
