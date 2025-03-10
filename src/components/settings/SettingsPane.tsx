'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import LabelFilter from './LabelFilter';
import RepoPrioritization from './RepoPrioritization';
import styles from './SettingsPane.module.css';
import { GearIcon, CloseIcon } from '../icons';
import RateLimit from '../RateLimit';

const SettingsPane = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div>
            <GearIcon className={styles.gearIcon} onClick={toggleVisibility} data-testid="gear-icon" />
            {isVisible && mounted && createPortal(
                <div className={styles.overlay}>
                    <div className={styles.settingsPane} data-testid='settings-pane'>
                        <CloseIcon className={styles.closeIcon} onClick={toggleVisibility} data-testid="close-icon" />
                        <LabelFilter />
                        <RepoPrioritization />
                        <RateLimit />
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default SettingsPane;
