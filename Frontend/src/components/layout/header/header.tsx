import { setLanguage } from "../../../core/redux/app-settings-slice";
import { useTheme } from "../../../core/theme/theme";
import { Dropdown } from "../../dropdown";
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks";
import { languageDropdownOptions } from "../../../core/constants";

export function Header() {
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.appSettings.language);
  const theme = useTheme();

  const handleLanguageChange = (language: string) =>
    dispatch(setLanguage(language));

  return (
    <header
      className={`h-24 px-6 shadow-sm border-b transition-colors duration-200 ${theme.surface} ${theme.border}`}
    >
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        <div className="flex items-center">
          <h1 className={`text-xl font-bold ${theme.text}`}>Library</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Dropdown
            value={currentLanguage}
            onChange={handleLanguageChange}
            options={languageDropdownOptions}
          />
        </div>
      </div>
    </header>
  );
}
