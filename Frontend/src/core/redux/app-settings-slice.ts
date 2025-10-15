import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import i18n from '../i18n';
import { AppSettingDefaults } from '../constants';
import Cookies from 'js-cookie';

export interface AppSettingsState {
  language: string;
  theme: string;
}

const initialState: AppSettingsState = {
  language: i18n.language || AppSettingDefaults.DEFAULT_LANGUAGE,
  theme: Cookies.get("theme")|| AppSettingDefaults.DEFAULT_THEME
};

export const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      i18n.changeLanguage(action.payload);
    },
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
      Cookies.set("theme", action.payload);
    }
  },
});

export const { setLanguage, setTheme } = appSettingsSlice.actions;
export default appSettingsSlice.reducer;