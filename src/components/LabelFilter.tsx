import React, { useState } from 'react';
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover } from '@reach/combobox';
import '@reach/combobox/styles.css';
import styles from './LabelFilter.module.css';
import { LabelFilterProps } from '../types'; // Import consolidated types

const LabelFilter: React.FC<LabelFilterProps> = ({ labelFilters, setLabelFilters, allLabels }) => {
  const [inputValue, setInputValue] = useState('');

  const addLabelFilter = (label: string) => {
    if (label && !labelFilters.includes(label)) {
      setLabelFilters([...labelFilters, label]);
    }
    setInputValue('');
  };

  const removeLabelFilter = (label: string) => {
    setLabelFilters(labelFilters.filter(l => l !== label));
  };

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
        <button onClick={() => addLabelFilter(inputValue)} className={styles.addButton}>Add</button>
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
