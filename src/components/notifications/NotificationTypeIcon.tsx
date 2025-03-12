import React from "react";
import { IssueIcon, PRIcon, ReleaseIcon } from "../icons";
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
  };

  const Icon = notificationTypeToIconMap[notificationType];
  const classList = [styles.typeIcon, styles[state.toLowerCase()]];
  if (isDraft) classList.push(styles.draft);
  console.log(classList);
  return <Icon className={classList.join(" ")} />;
};

export default NotificationTypeIcon;
