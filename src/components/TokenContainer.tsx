import React from 'react';
import Token from './Token';
import styles from './Token.module.css';

interface TokenContainerProps {
    tokens: string[];
    onRemove: (token: string) => void;
}

const TokenContainer: React.FC<TokenContainerProps> = ({ tokens, onRemove }) => {
    return (
        <div className={styles.tokenContainer}>
            {tokens.map(token => (
                <Token key={token} text={token} onRemove={() => onRemove(token)} />
            ))}
        </div>
    );
};

export default TokenContainer;
