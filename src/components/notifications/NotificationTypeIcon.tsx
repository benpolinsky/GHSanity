import React from "react";
import {
  IssueIcon,
  PRIcon,
  ReleaseIcon,
  CommunityIcon,
  ShieldIcon,
} from "../icons"; // Import ShieldIcon
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
    RepositoryDependabotAlertsThread: ShieldIcon, // Use ShieldIcon here
  };

  const Icon = notificationTypeToIconMap[notificationType];
  if (Icon) {
    const classList = [styles.typeIcon];
    if (state) classList.push(styles[state]);
    if (isDraft) classList.push(styles.draft);
    return <Icon className={classList.join(" ")} />;
  }
  return null;
};

export default NotificationTypeIcon;
