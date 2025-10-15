import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useForm, SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../core/theme/theme";
import { baseUrl } from "../../../core/constants";
import { LoginModel } from "./types";
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks";
import { useLogin } from "./hooks/useLogin";
import { authorize } from "../store/auth-slice";
import { toast } from "react-toastify";

function LoginPage() {
  const { login, error } = useLogin();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginModel>({
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginModel> = async (data) => {
    const result = await login({
      login: data.login,
      password: data.password,
    });

    if (result.success) {
      dispatch(
        authorize({
          username: result.data!.userName,
          email: result.data!.email,
        })
      );

      toast.success(t("auth.login.messages.successful-login"));
      navigate("/");
      return;
    } else {
      toast.error(t("apiErrors." + result.error!.errors[0].code));
    }
  };

  const redirectToGoogleFlow = () => {
    window.location.href =
      baseUrl + "/Auth/oauth/google?returnUrl=http://localhost:5173";
  };

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate, t]);

  return (
    <div className={`w-full content-center ${theme.background}`}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex flex-col gap-4 max-w-sm mx-auto p-6 rounded shadow ${theme.border} ${theme.surface}`}
      >
        <div className="flex flex-col">
          <input
            {...register("login", {
              required: t("auth.login.errors.login-required"),
            })}
            placeholder={t("auth.login.placeholders.login")}
            className={`p-2 rounded ${theme.border} ${theme.background} ${theme.text}`}
          />
          {errors.login && (
            <p className={`text-sm mt-1 ${theme.errortext}`}>
              {errors.login.message}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <input
            {...register("password", {
              required: t("auth.login.errors.password-required"),
            })}
            placeholder={t("auth.login.placeholders.password")}
            type="password"
            className={`p-2 rounded ${theme.border} ${theme.background} ${theme.text}`}
          />
          {errors.password && (
            <p className={`text-sm mt-1 ${theme.errortext}`}>
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={redirectToGoogleFlow}
          className={`py-2 rounded hover:opacity-80 transition ${theme.primary} ${theme.text}`}
        >
          Authenticate with Google
        </button>

        <button
          type="submit"
          className={`py-2 rounded hover:opacity-80 transition ${theme.primary} ${theme.text}`}
        >
          {t("auth.login.buttons.login-submit")}
        </button>

        <div>
          <p
            onClick={() => navigate("/forgot-password")}
            className={`cursor-pointer ${theme.text}`}
          >
            {t("auth.login.buttons.forgot-password")}
          </p>
        </div>
      </form>

      {error !== "" && <p className={`${theme.errortext} mt-2`}>{error}</p>}
    </div>
  );
}

export default LoginPage;
