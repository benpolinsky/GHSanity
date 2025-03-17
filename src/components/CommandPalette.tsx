import React, { useState, useContext, useEffect } from "react";
import Fuse from "fuse.js";
import { marked, Renderer } from "marked";
import styles from "./CommandPalette.module.css";
import { AppContext } from "@/store/AppContext";
import type { Notification } from "@/types";
import NotificationTypeIcon from "@/components/notifications/NotificationTypeIcon"; // Import NotificationTypeIcon

interface CommandPaletteProps {
  isVisible: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isVisible,
  onClose,
}) => {
  const { notifications } = useContext(AppContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Notification[]>([]);

  useEffect(() => {
    if (query) {
      const fuse = new Fuse(notifications, {
        keys: [
          "subject.title",
          "details.body",
          "subject.type",
          "repository.full_name",
          "details.labels",
        ],
        includeScore: true,
        findAllMatches: true,
      });
      const result = fuse.search(query);
      setResults(result.map((res) => res.item));
    } else {
      setResults([]);
    }
  }, [query, notifications]);

  const renderer = new marked.Renderer();
  renderer.heading = (text) => `<strong>${text}</strong>`;

  if (!isVisible) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.palette} onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          placeholder="Type a command..."
          className={styles.input}
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul className={styles.resultsList}>
          {results.map((notification) => (
            <CommandResultItem
              notification={notification}
              renderer={renderer}
              key={notification.id}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommandPalette;

const CommandResultItem: React.FC<{
  notification: Notification;
  renderer: Renderer;
}> = ({ notification, renderer }) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <li key={notification.id} className={styles.resultItem}>
      <a
        href={notification.details.html_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>
          <NotificationTypeIcon
            notificationType={notification.subject.type}
            state={notification.details.state}
            isDraft={notification.details.draft}
          />
          <strong>{notification.subject.title}</strong>
        </span>

        {notification.details.body && (
          <p
            dangerouslySetInnerHTML={{
              __html: marked(truncateText(notification.details.body, 200), {
                renderer,
              }),
            }}
          />
        )}
      </a>
    </li>
  );
};
