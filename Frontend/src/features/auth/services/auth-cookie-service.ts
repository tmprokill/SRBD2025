import Cookies from "js-cookie";
import { AuthCookie, AuthCookiePayload } from "../models/authCookie";
import { CookieConstants } from "../../../core/constants";

export class AuthCookieService {
  public static getAuthCookies(): AuthCookie {
    const username = Cookies.get(CookieConstants.USERNAME);
    const email = Cookies.get(CookieConstants.EMAIL);

    const result: AuthCookie = {
      username,
      email,
    };
    return result;
  }

  public static setAuthCookies(payload: AuthCookiePayload) {
    Cookies.set(CookieConstants.USERNAME, payload.username, { expires: 7 });
    Cookies.set(CookieConstants.EMAIL, payload.email, { expires: 7 });
  }

  public static removeAuthCookies(): void {
    Cookies.remove(CookieConstants.USERNAME);
    Cookies.remove(CookieConstants.EMAIL);
  }
}
