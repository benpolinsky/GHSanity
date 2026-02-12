"use client";

import React, { useRef, useState } from "react";
import styles from "./ComboboxContainer.module.css";

interface ComboboxContainerProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  options: string[];
  onSelect: (value: string) => void;
  placeholder: string;
  buttonText: string;
}

const ComboboxContainer: React.FC<ComboboxContainerProps> = ({
  inputValue,
  setInputValue,
  options,
  onSelect,
  placeholder,
  buttonText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const select = (value: string) => {
    onSelect(value);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      select(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className={styles.comboboxContainer}>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.comboboxInput}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="combo-listbox"
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `combo-opt-${activeIndex}` : undefined
          }
        />
        {isOpen && filtered.length > 0 && (
          <ul
            ref={listRef}
            className={styles.comboboxList}
            role="listbox"
            id="combo-listbox"
          >
            {filtered.map((option, i) => (
              <li
                key={option}
                id={`combo-opt-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                className={`${styles.comboboxOption} ${i === activeIndex ? styles.comboboxOptionActive : ""}`}
                onMouseDown={() => select(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button onClick={() => select(inputValue)} className={styles.addButton}>
        {buttonText}
      </button>
    </div>
  );
};

export default ComboboxContainer;
