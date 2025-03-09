'use client';

import React, { useContext, useState } from 'react';
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover } from '@reach/combobox';
import '@reach/combobox/styles.css';
import styles from './LabelFilter.module.css';
import { AppContext, AppDispatchContext } from '@/store/AppContext';
import { Label } from '@/types';

const LabelFilter = () => {
  const { labelFilters, notifications } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);
  const [inputValue, setInputValue] = useState('');

  const addLabelFilter = (label: string) => {
    if (label && !labelFilters.includes(label)) {
      dispatch({ action: "SET_LABEL_FILTERS", payload: [...labelFilters, label] });
    }
    setInputValue('');
  };

  const removeLabelFilter = (label: string) => {
    const lablesWithoutRemoved = labelFilters.filter(l => l !== label);
    dispatch({ action: "SET_LABEL_FILTERS", payload: lablesWithoutRemoved })
  };

  const allLabels: string[] = []

  notifications.forEach((notification) => {
    notification.details.labels?.forEach((label: Label) => {
      if (!allLabels.includes(label.name)) {
        allLabels.push(label.name)
      }
    })
  })

  return (
    <div className={styles.labelFilter}>
      <p id="label-filter">Label Filter</p>
      <div className={styles.comboboxContainer}>
        <Combobox
          onSelect={addLabelFilter}
          aria-labelledby="label-filter"
        >
          <ComboboxInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Exclude by label"
            className={styles.comboboxInput}
          />
          <ComboboxPopover>
            <ComboboxList className={styles.comboboxList}>
              {allLabels.map(label => (
                <ComboboxOption key={label} value={label} className={styles.comboboxOption} />
              ))}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox>
        <button data-testid="addLabel" onClick={() => addLabelFilter(inputValue)} className={styles.addButton}>Add</button>
      </div>
      <div className={styles.selectedLabels}>
        {labelFilters.map(label => (
          <span key={label} className={styles.label}>
            {label}
            <button onClick={() => removeLabelFilter(label)} className={styles.removeButton}>x</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default LabelFilter;
