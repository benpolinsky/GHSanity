export interface Label {
  id: number;
  name: string;
  color: string; 
  description: string;
  url: string;
}

export interface Notification {
  id: string;
  reason: string;
  repository: {
    full_name: string;
  };
  subject: {
    title: string;
    url: string;
    type: "PullRequest" | "Issue" | "Release";
  };
  details: {
    state: string;
    labels?: Label[];
  };
}

export interface NotificationItemProps {
  notification: Notification;
  doneNotifications: Set<string>;
  markNotificationAsDone: (id: string) => Promise<void>;
  getWebsiteUrl: (apiUrl: string) => string;
  toggleNotificationSelection: (id: string) => void;
  isSelected: boolean;
}

export interface NotificationListProps {
  token: string;
  notifications: Notification[];
  labelFilters: string[];
  prioritizedRepos: string[];
  error: string | null;
  filter: ValidFilters | null;
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

export type ValidFilters = 'Issue' | 'PullRequest' | null;
