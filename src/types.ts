export interface Label {
  id: number;
  name: string;
  color: string;
  description: string;
  url: string;
}

export type NotificationReason =
  | "approval_requested"
  | "assign"
  | "author"
  | "comment"
  | "ci_activity"
  | "invitation"
  | "manual"
  | "member_feature_requested"
  | "mention"
  | "review_requested"
  | "security_alert"
  | "security_advisory_credit"
  | "state_change"
  | "subscribed"
  | "team_mention";

export type NotificationType =
  | "Issue"
  | "PullRequest"
  | "Release"
  | "Discussion"
  | "RepositoryDependabotAlertsThread";

export interface Notification {
  id: string;
  reason: NotificationReason;
  repository: {
    full_name: string;
    name: string;
  };
  subject: {
    title: string;
    url: string;
    type: NotificationType;
  };
  details: {
    title: string;
    body?: string;
    draft: boolean;
    html_url: string;
    labels?: Label[];
    state: string;
  };
  url: string;
}

export interface NotificationItemProps {
  notification: Notification;
  doneNotifications: Set<string>;
  markNotificationAsDone: (id: string) => Promise<void>;
  markNotificationAsReadInternally: (id: string) => void;
  toggleNotificationSelection: (id: string) => void;
  isSelected: boolean;
  animationIndex?: number;
}

export interface NotificationListProps {
  token: string;
  notifications: Notification[];
  labelFilters: string[];
  prioritizedRepos: string[];
  error: string | null;
  filter: NotificationType | null;
  additionalFilter: string | null;
  stateFilter: string;
  isLoading: boolean;
}

export interface SettingsPaneProps {
  labelFilters: string[];
  setLabelFilters: React.Dispatch<React.SetStateAction<string[]>>;
  allLabels: string[];
  prioritizedRepos: string[];
  setPrioritizedRepos: (repos: string[]) => void;
  allRepoNames: string[];
}

export interface LabelFilterProps {
  labelFilters: string[];
  setLabelFilters: React.Dispatch<React.SetStateAction<string[]>>;
  allLabels: string[];
}

export interface RepoPrioritizationProps {
  prioritizedRepos: string[];
  setPrioritizedRepos: (repos: string[]) => void;
  allRepoNames: string[];
}

export type ReasonFilter =
  | "assign"
  | "participating"
  | "mention"
  | "team_mention"
  | "review_requested"
  | null;
export interface GitHubComment {
  id: number;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    id: number;
  };
  body: string;
  html_url: string;
}
