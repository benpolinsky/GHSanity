import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import LabelFilter from './LabelFilter';
import RepoPrioritization from './RepoPrioritization';
import styles from './SettingsPane.module.css';
import GearIcon from '../assets/gear.svg?react';
import CloseIcon from '../assets/close.svg?react';
import RateLimit from '../RateLimit';

interface SettingsPaneProps {
    labelFilters: string[];
    setLabelFilters: any;
    allLabels: string[];
    prioritizedRepos: string[];
    setPrioritizedRepos: (repos: string[]) => void;
}

const SettingsPane: React.FC<SettingsPaneProps> = ({ labelFilters, setLabelFilters, allLabels, prioritizedRepos, setPrioritizedRepos }) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div>
            <GearIcon className={styles.gearIcon} onClick={toggleVisibility} />
            {isVisible && ReactDOM.createPortal(
                <div className={styles.overlay}>
                    <div className={styles.settingsPane}>
                        <CloseIcon onClick={toggleVisibility} className={styles.closeIcon} />
                        <LabelFilter labelFilters={labelFilters} setLabelFilters={setLabelFilters} allLabels={allLabels} />
                        <RepoPrioritization prioritizedRepos={prioritizedRepos} setPrioritizedRepos={setPrioritizedRepos} />
                        <RateLimit />
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default SettingsPane;
