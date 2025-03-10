'use client';

import React from 'react';
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover } from '@reach/combobox';
import '@reach/combobox/styles.css';
import styles from './ComboBoxContainer.module.css';

interface ComboboxContainerProps {
    inputValue: string;
    setInputValue: (value: string) => void;
    options: string[];
    onSelect: (value: string) => void;
    placeholder: string;
    buttonText: string;
}

const ComboboxContainer: React.FC<ComboboxContainerProps> = ({ inputValue, setInputValue, options, onSelect, placeholder, buttonText }) => {
    return (
        <div className={styles.comboboxContainer}>
            <Combobox
                onSelect={onSelect}
                openOnFocus={true}
            >
                <ComboboxInput
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder}
                    className={styles.comboboxInput}
                />
                <ComboboxPopover>
                    <ComboboxList className={styles.comboboxList}>
                        {options.map(option => (
                            <ComboboxOption key={option} value={option} className={styles.comboboxOption} />
                        ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
            <button onClick={() => onSelect(inputValue)} className={styles.addButton}>{buttonText}</button>
        </div>
    );
};

export default ComboboxContainer;
