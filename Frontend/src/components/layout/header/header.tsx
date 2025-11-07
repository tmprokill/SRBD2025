import { setLanguage } from "../../../core/redux/app-settings-slice";
import { useTheme } from "../../../core/theme/theme";
import { Dropdown } from "../../dropdown";
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks";
import { languageDropdownOptions } from "../../../core/constants";
import { NavLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

export function Header() {
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.appSettings.language);
  const theme = useTheme();
  const { t } = useTranslation();
  const location = useLocation();

  const handleLanguageChange = (language: string) =>
    dispatch(setLanguage(language));

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path: string) => {
    const baseClass = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    const activeClass = isActive(path)
      ? "bg-blue-600 text-white"
      : `${theme.text} hover:bg-gray-100 dark:hover:bg-gray-800`;
    return `${baseClass} ${activeClass}`;
  };

  return (
    <header
      className={`h-24 px-6 shadow-sm border-b transition-colors duration-200 ${theme.surface} ${theme.border}`}
    >
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <NavLink to="/" className={`text-xl font-bold ${theme.text} hover:opacity-80 transition-opacity`}>
            Library
          </NavLink>
          
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink to="/" className={navLinkClass("/")}>
              {t("header.nav.home")}
            </NavLink>
            <NavLink to="/readers" className={navLinkClass("/readers")}>
              {t("header.nav.readers")}
            </NavLink>
            <NavLink to="/books" className={navLinkClass("/books")}>
              {t("header.nav.books")}
            </NavLink>
            <NavLink to="/borrowings" className={navLinkClass("/borrowings")}>
              {t("header.nav.borrowings")}
            </NavLink>
            <NavLink to="/sales" className={navLinkClass("/sales")}>
              {t("header.nav.sales")}
            </NavLink>
          </nav>
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
