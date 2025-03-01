'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import LabelFilter from './LabelFilter';
import RepoPrioritization from './RepoPrioritization';
import styles from './SettingsPane.module.css';
import { GearIcon, CloseIcon } from './icons';
import RateLimit from '../RateLimit';
import { SettingsPaneProps } from '../types'; // Import consolidated types

const SettingsPane: React.FC<SettingsPaneProps> = ({ labelFilters, setLabelFilters, allLabels, prioritizedRepos, setPrioritizedRepos, allRepoNames }) => {
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
                    <div className={styles.settingsPane}>
                        <CloseIcon onClick={toggleVisibility} className={styles.closeIcon} data-testid="close-icon" />
                        <LabelFilter labelFilters={labelFilters} setLabelFilters={setLabelFilters} allLabels={allLabels} />
                        <RepoPrioritization prioritizedRepos={prioritizedRepos} setPrioritizedRepos={setPrioritizedRepos} allRepoNames={allRepoNames} />
                        <RateLimit />
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default SettingsPane;
