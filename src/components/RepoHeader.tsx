import { ChevronRight, ChevronDown } from "./icons/Chevrons";
import styles from "./RepoHeader.module.css";
import chevronStyles from "./icons/Icons.module.css";
import { Notification } from "../types"; // Import consolidated types
export function RepoHeader({
  repoName,
  selectedNotifications,
  groupedNotifications,
  collapsedRepos,
  toggleRepoCollapse,
  toggleRepoSelection,
}: {
  repoName: string;
  groupedNotifications: Record<string, Notification[]>;
  collapsedRepos: Set<string>;
  toggleRepoCollapse: (repoName: string) => void;
  toggleRepoSelection: (repoName: string) => void;
  selectedNotifications: Set<string>;
}) {
  return (
    <h2 className={styles.repoName}>
      <div className={styles.repoHeader}>
        <button
          className={chevronStyles.collapseButton}
          onClick={() => toggleRepoCollapse(repoName)}
        >
          {collapsedRepos.has(repoName) ? <ChevronRight /> : <ChevronDown />}
        </button>
        <span className={styles.repoNameText}>{repoName}</span>
        <span className={styles.repoCount}>
          ({groupedNotifications[repoName].length})
        </span>
        <button
          className={styles.selectButton}
          onClick={() => toggleRepoSelection(repoName)}
        >
          {groupedNotifications[repoName].every((notification) =>
            selectedNotifications.has(notification.id)
          )
            ? "Deselect All"
            : "Select All"}
        </button>
      </div>
    </h2>
  );
}
