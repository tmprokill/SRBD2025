import { ChangeEvent } from "react";
import { useTheme } from "../core/theme/theme";
import { useTranslation } from "react-i18next";

interface OptionsEntry<T extends string> {
  option: T;
  label: string;
}

interface DropdownProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: readonly OptionsEntry<T>[];
  label?: string;
}

export function Dropdown<T extends string>({
  value,
  onChange,
  options,
}: DropdownProps<T>) {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as T);
  };

  return (
    <div className="flex flex-col">
      <select
        value={value}
        onChange={handleChange}
        className={`${theme.text} ${theme.background} font-bold px-3 py-2 rounded-lg border shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        {options.map((option) => (
          <option key={option.option} value={option.option}>
            {t(option.label)}
          </option>
        ))}
      </select>
    </div>
  );
}
