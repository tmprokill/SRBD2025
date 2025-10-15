import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useRef } from "react";
import { useTheme } from "../../../core/theme/theme";
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks";
import { useGetProfile } from "./hooks/useGetProfile";
import { authorize } from "../store/auth-slice";

function ExternalLoginCallbackPage() {
  const { getProfile, error } = useGetProfile();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const isRendered = useRef(0);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const result = searchParams.get("result");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
      return;
    }

    const handleLogin = async () => {
      if (isRendered.current) return;
      isRendered.current = 1;

      if (!result || result != "success") {
        toast.error(t("auth.externalLoginCallback.errors.not-valid-data"));
        navigate("/");
        return;
      }

      const res = await getProfile();
      if (res.success) {
        dispatch(
          authorize({
            username: res.data!.userName,
            email: res.data!.email,
          })
        );
        toast.success(t("auth.login.messages.successful-login"));
        navigate("/");
      }
      else {
        toast.error(t("apiErrors." + res.error!.errors[0].code));
      }
    };

    handleLogin();
  }, []);

  return (
    <div className={`w-full content-center ${theme.background}`}>
      <div>{t("auth.externalLoginCallback.messages.loading")}</div>
    </div>
  );
}

export default ExternalLoginCallbackPage;
