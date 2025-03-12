import type { NotificationReason, ReasonFilter } from "../types";

export function isParticipating(reason: NotificationReason): boolean {
  return (
    reason === "comment" ||
    reason === "author" ||
    reason === "assign" ||
    reason === "mention" ||
    reason === "team_mention" ||
    reason === "review_requested"
  );
}

export function reasonMatchesFilter(
  reason: NotificationReason,
  reasonFilter: ReasonFilter | null,
): boolean {
  const exactMatch = reasonFilter ? reason === reasonFilter : true;

  if (exactMatch) return true;

  if (reasonFilter === "participating" && isParticipating(reason)) return true;

  return false;
}
