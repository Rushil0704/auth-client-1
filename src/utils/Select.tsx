import { useState, useRef, useEffect } from "react";
import Icon from "./Icon";
import { cn } from "./lib/utils";

interface Props {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  items: { value: string; text: string }[];
  value?: string[];
  onChange?: (selected: string[]) => void;
}

const Select = ({
  name,
  label,
  required,
  error,
  className,
  items,
  value = [],
  onChange,
}: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    let newValue: string[];
    if (value.includes(val)) {
      newValue = []; // Unselect if already selected
    } else {
      newValue = [val]; // Only one selected at a time
    }
    if (onChange) {
      onChange(newValue);
    }
    setOpen(false);
  };

  return (
    <div className={`relative`} ref={ref}>
      {label && (
        <label className="text-text dark:text-textDark mb-2 block text-xs font-medium sm:text-base">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={cn(
          `bg-bgc dark:bg-fgcDark flex cursor-pointer items-center rounded-xl border px-4 py-2 sm:px-5 ${error ? "border-red-500" : "border-gray-200 dark:border-gray-700"}`,
          className,
        )}
        onClick={() => setOpen(!open)}
      >
        <span
          className={`flex-1 ${value.length === 0 ? "text-textSecondary" : "text-text dark:text-textDark"} `}
        >
          {value.length
            ? items.filter((i) => value.includes(i.value)).map((i) => i.text)
            : `Select ${name}`}
        </span>
        <Icon
          icon="arrow-down"
          className={`text-textSecondary ml-1 h-4 w-4 sm:h-6 sm:w-6 ${open === true ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <div className="bg-bgc dark:bg-fgcDark border-textSecondary/20 absolute z-50 mt-2 w-full rounded-xl border p-2">
          {items.map((item) => {
            const checked = value.includes(item.value);
            return (
              <label
                key={item.value}
                className="hover:bg-fgc dark:hover:bg-bgcDark/50 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 sm:gap-4"
              >
                {/* Custom Checkbox */}
                <span className="relative flex h-5 w-5 cursor-pointer items-center justify-center sm:h-6 sm:w-6">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleSelect(item.value)}
                    className="absolute h-4 w-4 cursor-pointer bg-transparent opacity-0 sm:h-5 sm:w-5"
                  />
                  <span
                    className={`border-textSecondary flex h-4 w-4 items-center justify-center rounded-[2px] border transition-colors duration-150 sm:h-[17px] sm:w-[17px] ${
                      checked ? "!border-primary bg-primary" : "bg-transparent"
                    }`}
                  >
                    {checked && (
                      <Icon
                        icon="check"
                        className="ml-[1px] mt-[1px] h-2.5 w-2.5 sm:ml-0.5 sm:h-3 sm:w-3"
                      />
                    )}
                  </span>
                </span>
                <span className="text-xs text-gray-900 dark:text-gray-100 sm:text-base">
                  {item.text}
                </span>
              </label>
            );
          })}
        </div>
      )}
      {error && (
        <span className="inline-block px-5 text-sm text-red-500 sm:text-base">
          {error && (
            <>
              <span>{error}</span>
            </>
          )}
          &nbsp;
        </span>
      )}
    </div>
  );
};

export default Select;
