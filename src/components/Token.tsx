import React from 'react';
import styles from './Token.module.css'; // Use existing styles

interface TokenProps {
    text: string;
    onRemove: () => void;
    className: string
}

const Token: React.FC<TokenProps> = ({ text, onRemove }) => {
    return (
        <span className={styles.label}>
            {text}
            <button onClick={onRemove} className={styles.removeButton}>x</button>
        </span>
    );
};

export default Token;
