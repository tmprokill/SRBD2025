import { apiRequest } from "../../../core/api/api-request-handler";
import { ApiResponse } from "../../../core/api/types";
import { LoginModel, LoginResponse } from "../login/types";
import { ChangePasswordModel, ForgotPasswordModel } from "../password/types";
import { RegisterModel } from "../register/types";

export class AuthApiService {
  private controller = "/Auth";

  async loginAsync(
    loginModel: LoginModel
  ): Promise<ApiResponse<LoginResponse>> {
    const res = await apiRequest<LoginResponse>({
      method: "post",
      url: this.controller + "/login",
      data: loginModel,
    });

    return res;
  }

  async getUserProfile(): Promise<ApiResponse<LoginResponse>> {
    const res = await apiRequest<LoginResponse>({
      method: "get",
      url: this.controller + "/profile",
    });

    return res;
  }

  async registerAsync(
    registerModel: RegisterModel
  ): Promise<ApiResponse<null>> {
    const res = await apiRequest<null>({
      method: "post",
      url: this.controller + "/register",
      data: registerModel,
    });

    return res;
  }

  async forgotPasswordAsync(
    forgotPasswordModel: ForgotPasswordModel
  ): Promise<ApiResponse<null>> {
    const res = await apiRequest<null>({
      method: "get",
      url: this.controller + "/password/forgot",
      params: { email: forgotPasswordModel.email },
    });

    return res;
  }

  async changePasswordAsync(
    changePasswordModel: ChangePasswordModel
  ): Promise<ApiResponse<null>> {
    const res = await apiRequest<null>({
      method: "post",
      url: this.controller + "/password/change",
      data: changePasswordModel,
    });

    return res;
  }

  async logoutAsync(): Promise<ApiResponse<null>> {
    const res = await apiRequest<null>({
      method: "get",
      url: this.controller + "/logout",
    });

    return res;
  }

  async checkIsUniqueEmail(email: string): Promise<ApiResponse<null>> {
    const res = await apiRequest<null>({
      method: "get",
      url: this.controller + "/email/unique",
      params: {email}
    });

    return res;
  }

  async checkIsUniqueUsername(username: string): Promise<ApiResponse<null>> {
    const res = await apiRequest<null>({
      method: "get",
      url: this.controller + "/username/unique",
      params: {username}
    });

    return res;
  }
}
