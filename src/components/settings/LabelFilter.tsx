'use client';

import React, { useContext, useState } from 'react';
import { AppContext, AppDispatchContext } from '@/store/AppContext';
import { Label } from '@/types';
import ComboboxComponent from '../ComboboxContainer';
import Token from '../Token';
import styles from './LabelFilter.module.css';

const LabelFilter = () => {
  const { labelFilters, notifications } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);
  const [inputValue, setInputValue] = useState('');

  const addLabelFilter = (label: string) => {
    if (label && !labelFilters.includes(label)) {
      dispatch({ type: "SET_LABEL_FILTERS", payload: [...labelFilters, label] });
    }
    setInputValue('');
  };

  const removeLabelFilter = (label: string) => {
    const lablesWithoutRemoved = labelFilters.filter(l => l !== label);
    dispatch({ type: "SET_LABEL_FILTERS", payload: lablesWithoutRemoved })
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
      <p id="label-filter">Exclude notifications by label</p>

      <ComboboxComponent
        inputValue={inputValue}
        setInputValue={setInputValue}
        options={allLabels}
        onSelect={addLabelFilter}
        placeholder="Select and press enter"
        buttonText="Add"
      />

      <div className={styles.selectedLabels}>
        {labelFilters.map(label => (
          <Token key={label} text={label} onRemove={() => removeLabelFilter(label)} />
        ))}
      </div>
    </div>
  );
};

export default LabelFilter;
