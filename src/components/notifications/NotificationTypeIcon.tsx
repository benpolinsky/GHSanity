import React from "react";
import {
  IssueIcon,
  PRIcon,
  ReleaseIcon,
  CommunityIcon,
  ShieldIcon,
} from "../icons";
import { NotificationType } from "../../types";
import styles from "./NotificationTypeIcon.module.css";
import { IconProps } from "../icons/ReleaseIcon";

const NotificationTypeIcon = ({
  notificationType,
  state,
  isDraft,
}: {
  notificationType: NotificationType;
  state: string;
  isDraft: boolean;
}) => {
  const notificationTypeToIconMap: Record<
    NotificationType,
    React.FunctionComponent<IconProps>
  > = {
    PullRequest: PRIcon,
    Release: ReleaseIcon,
    Issue: IssueIcon,
    Discussion: CommunityIcon,
    RepositoryDependabotAlertsThread: ShieldIcon,
  };

  const Icon = notificationTypeToIconMap[notificationType];
  if (!Icon) return null;

  let colorClass = styles.stateOpen;
  if (isDraft) {
    colorClass = styles.draft;
  } else if (state === "merged") {
    colorClass = styles.merged;
  } else if (state?.includes("closed")) {
    colorClass = styles.closed;
  }

  return <Icon className={`${styles.typeIcon} ${colorClass}`} />;
};

export default NotificationTypeIcon;
