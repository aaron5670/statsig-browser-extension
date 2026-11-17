import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { FiExternalLink } from "react-icons/fi";

export const chromeWebStoreReviewsUrl =
  "https://chromewebstore.google.com/detail/doialjibpidkdpdneplcnmkbdojpagdd/reviews";

const storageKey = "statsig-chrome-review-prompt";
const requiredActiveDays = 5;

export function markReviewPromptSeen() {
  try {
    localStorage.setItem(storageKey, "seen");
    return true;
  } catch {
    return false;
  }
}

function recordActiveDay() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "seen") return false;

    const days: string[] = JSON.parse(saved ?? "[]");
    const today = new Date().toDateString();
    if (days.includes(today)) return false;

    days.push(today);
    if (days.length >= requiredActiveDays) return markReviewPromptSeen();

    localStorage.setItem(storageKey, JSON.stringify(days));
  } catch {
    // The invitation needs persistent storage to avoid repeating.
  }
  return false;
}

export default function ReviewPrompt({
  paused,
  onDismiss
}: {
  paused: boolean;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!paused && recordActiveDay()) setVisible(true);
  }, [paused]);

  if (paused || !visible) return null;

  return (
    <aside
      aria-label="Extension review"
      className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-y border-divider py-1">
      <p className="text-[13px] text-foreground-700">
        How’s the extension working for you?
      </p>
      <div className="flex flex-wrap items-center gap-1">
        <a
          className="inline-flex min-h-9 items-center gap-2 rounded-small border border-default-300 px-3 text-xs font-medium text-foreground hover:bg-default-50 focus-visible:outline-2 focus-visible:outline-focus"
          href={chromeWebStoreReviewsUrl}
          rel="noopener noreferrer"
          target="_blank">
          Leave a review
          <FiExternalLink aria-hidden="true" size={14} />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <Button
          className="min-h-9"
          onPress={onDismiss}
          radius="sm"
          size="sm"
          variant="light">
          Dismiss
        </Button>
      </div>
    </aside>
  );
}
