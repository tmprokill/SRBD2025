import { setLanguage, setTheme } from "../../../core/redux/app-settings-slice";
import { useTheme } from "../../../core/theme/theme";
import { LanguageConstants, ThemeConstants } from "../../../core/constants";
import { Dropdown } from "../../dropdown";
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks";

export function Header() {
  const dispatch = useAppDispatch();

  const currentLanguage = useAppSelector((state) => state.appSettings.language);

  const currentTheme = useAppSelector((state) => state.appSettings.theme);

  const theme = useTheme();

  const handleLanguageChange = (language: string) =>
    dispatch(setLanguage(language));
  const handleThemeChange = (themeValue: string) =>
    dispatch(setTheme(themeValue));

  const languageDropdownOptions = [
    {
      option: LanguageConstants.ENGLISH,
      label: "English",
    },
    {
      option: LanguageConstants.UKRAINIAN,
      label: "Українська",
    },
  ];

  const themeDropdownOptions = [
    {
      option: ThemeConstants.DARK,
      label: `appsettings.theme.${ThemeConstants.DARK}`,
    },
    {
      option: ThemeConstants.LIGHT,
      label: `appsettings.theme.${ThemeConstants.LIGHT}`,
    },
  ];

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
          <Dropdown
            value={currentTheme}
            onChange={handleThemeChange}
            options={themeDropdownOptions}
          />
        </div>
      </div>
    </header>
  );
}
