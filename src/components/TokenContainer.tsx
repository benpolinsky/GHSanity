import React, { useState } from "react";
import Token from "./Token";
import styles from "./Token.module.css";

interface TokenContainerProps {
  tokens: string[];
  onRemove: (token: string) => void;
  onReorder?: (tokens: string[]) => void;
}

const TokenContainer: React.FC<TokenContainerProps> = ({
  tokens,
  onRemove,
  onReorder,
}) => {
  const [draggedToken, setDraggedToken] = useState<string | null>(null);

  const handleDragStart = (
    event: React.DragEvent<HTMLSpanElement>,
    token: string,
  ) => {
    setDraggedToken(token);
  };

  const handleDragOver = (event: React.DragEvent<HTMLSpanElement>) => {
    event.preventDefault();
  };

  const handleDrop = (
    event: React.DragEvent<HTMLSpanElement>,
    targetToken: string,
  ) => {
    event.preventDefault();
    if (draggedToken === null) return;

    const draggedIndex = tokens.indexOf(draggedToken);
    const targetIndex = tokens.indexOf(targetToken);

    const newTokens = [...tokens];
    newTokens.splice(draggedIndex, 1);
    newTokens.splice(targetIndex, 0, draggedToken);

    onReorder?.(newTokens);
    setDraggedToken(null);
  };

  return (
    <div className={styles.tokenContainer}>
      {tokens.map((token) => (
        <Token
          key={token}
          text={token}
          onRemove={() => onRemove(token)}
          onDragStart={onReorder ? handleDragStart : undefined}
          onDragOver={onReorder ? handleDragOver : undefined}
          onDrop={onReorder ? handleDrop : undefined}
        />
      ))}
    </div>
  );
};

export default TokenContainer;
