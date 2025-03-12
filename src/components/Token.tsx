import React from "react";
import styles from "./Token.module.css"; // Use existing styles

interface TokenProps {
  text: string;
  onRemove: () => void;
  onDragStart?: (event: React.DragEvent<HTMLSpanElement>, text: string) => void;
  onDragOver?: (event: React.DragEvent<HTMLSpanElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLSpanElement>, text: string) => void;
}

const Token: React.FC<TokenProps> = ({
  text,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  return (
    <span
      className={`${styles.label} ${onDragStart ? styles.draggable : ""}`}
      draggable={!!onDragStart}
      onDragStart={
        onDragStart ? (event) => onDragStart(event, text) : undefined
      }
      onDragOver={onDragOver}
      onDrop={onDrop ? (event) => onDrop(event, text) : undefined}
    >
      {text}
      <button onClick={onRemove} className={styles.removeButton}>
        x
      </button>
    </span>
  );
};

export default Token;
