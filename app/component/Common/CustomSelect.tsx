"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./CustomSelect.module.css";

interface Option {
  value: number;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function CustomSelect({
  options,
  value,
  onChange,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function handleToggle() {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  }

  function handleSelect(optionValue: number) {
    onChange(optionValue);
    setIsOpen(false);
  }

  return (
    <div
      className={`${styles.customSelect} ${disabled ? styles.disabled : ""}`}
      ref={selectRef}
    >
      <div
        className={`${styles.selectTrigger} ${isOpen ? styles.open : ""}`}
        onClick={handleToggle}
      >
        <span>{selectedOption?.label}</span>
        <svg
          className={`${styles.arrow} ${isOpen ? styles.arrowUp : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {isOpen && (
        <ul className={styles.optionsList}>
          {options.map((option) => (
            <li
              key={option.value}
              className={`${styles.option} ${
                option.value === value ? styles.selected : ""
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
