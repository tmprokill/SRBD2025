export interface LoginModel {
  login: string;
  password: string;
}

export interface LoginResponse{
    email: string,
    userName: string,
    token: string,
    refreshToken: string
}