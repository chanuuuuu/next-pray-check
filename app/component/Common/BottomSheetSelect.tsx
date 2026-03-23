"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type Option<T extends string | number> = {
  value: T;
  label: string;
  sublabel?: string;
};

type BottomSheetSelectProps<T extends string | number> = {
  options: Option<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  name?: string;
  className?: string;
};

type DropdownPos = {
  top: number;
  width: number;
  left?: number;
  right?: number;
};

export function BottomSheetSelect<T extends string | number>({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  name,
  className,
}: BottomSheetSelectProps<T>) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<T>(
    (defaultValue ?? options[0]?.value) as T,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<DropdownPos>({
    top: 0,
    width: 160,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);

  const value = isControlled ? controlledValue : internalValue;
  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const width = rect.width;
      if (rect.right > vw / 2) {
        setDropdownPos({
          top: rect.bottom + 6,
          right: vw - rect.right,
          width,
        });
      } else {
        setDropdownPos({ top: rect.bottom + 6, left: rect.left, width });
      }
    }
    setIsOpen(true);
  };

  const handleSelect = (optValue: T) => {
    if (!isControlled) setInternalValue(optValue);
    onChange?.(optValue);
    setIsOpen(false);
  };

  const transformOrigin =
    dropdownPos.right !== undefined ? "top right" : "top left";

  return (
    <>
      {name && <input type="hidden" name={name} value={value ?? ""} readOnly />}
      <button
        data-component="BottomSheetSelect"
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={`flex justify-between gap-3 glass rounded-xl pl-4 pr-4 px-2.5 py-1 ${className ?? ""}`}
        style={{
          fontSize: "0.8rem",
          fontWeight: 500,
          color: "hsl(var(--foreground))",
        }}
      >
        <span className="truncate max-w-[10rem]">{selectedLabel}</span>
        <ChevronDown
          className="w-3 h-3 shrink-0"
          style={{ color: "hsl(var(--muted-foreground))" }}
        />
      </button>

      <AnimatePresence>
        {isOpen && typeof document !== "undefined" && createPortal(
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed z-[201] glass-strong rounded-2xl overflow-hidden"
              style={{
                top: dropdownPos.top,
                left: dropdownPos.left,
                right: dropdownPos.right,
                width: dropdownPos.width,
                transformOrigin,
                maxHeight: "min(50vh, calc(100dvh - " + dropdownPos.top + "px - 1rem))",
                overflowY: "auto",
              }}
            >
              <div className="py-2 space-y-0.5 px-2">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all active:scale-[0.98]"
                    style={{
                      background:
                        value === opt.value
                          ? "hsl(var(--primary) / 0.1)"
                          : "transparent",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color:
                            value === opt.value
                              ? "hsl(var(--primary))"
                              : "hsl(var(--muted-foreground))",
                        }}
                      >
                        {opt.label}
                      </span>
                      {opt.sublabel && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            color:
                              value === opt.value
                                ? "hsl(var(--primary) / 0.7)"
                                : "hsl(var(--muted-foreground) / 0.6)",
                          }}
                        >
                          {opt.sublabel}
                        </span>
                      )}
                    </span>
                    {value === opt.value && (
                      <Check
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: "hsl(var(--primary))" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>,
          document.body
        )}
      </AnimatePresence>
    </>
  );
}
