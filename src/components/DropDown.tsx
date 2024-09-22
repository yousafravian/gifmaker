import { ChevronDownIcon } from "lucide-react";
import { clsx } from "clsx";
import { Field, Select } from "@headlessui/react";
import DropDownOption from "../models/drop-down-option.model";

function DropDown<T extends DropDownOption>({
  className = "",
  disabled = false,
  options,
  onChange,
}: {
  className?: string;
  disabled?: boolean;
  options: T[];
  onChange: (index: number, value: T["value"]) => void;
}) {
  return (
    <div
      className={clsx(
        "w-full max-w-md px-4",
        className,
        disabled ? "pointer-events-none" : "",
      )}
    >
      <Field>
        <div className="relative">
          <Select
            onChange={(event) => {
              const index = event.target.selectedIndex;
              const value = event.target.value as T["value"];
              onChange(index, value);
            }}
            className={clsx(
              "block w-full appearance-none rounded-lg border-none bg-gray-700 dark:bg-white/5 py-1.5 px-3 pr-8 text-sm/6 text-white",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
            )}
          >
            {options.map((option, index) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
            aria-hidden="true"
          />
        </div>
      </Field>
    </div>
  );
}

export default DropDown;
