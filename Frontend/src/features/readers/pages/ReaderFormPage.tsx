import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useAddReader,
  useUpdateReader,
  useGetReaderDetails,
} from "../hooks/useReaders";
import { ReaderDTO } from "../services/readerApiService";
import { useNavigate, useParams } from "react-router";

function ReaderFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { readerId } = useParams<{ readerId: string }>();
  const isEditMode = !!readerId;

  const { addReader, isLoading: isAdding } = useAddReader();
  const { updateReader, isLoading: isUpdating } = useUpdateReader();
  const { getReaderDetails, isLoading: isLoadingDetails } =
    useGetReaderDetails();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReaderDTO>({
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (!isEditMode || !readerId) return;
    (async () => {
      const res = await getReaderDetails(parseInt(readerId));
      if (res.success && res.data) {
        reset({
          fullName: res.data.fullName,
          phone: res.data.phone,
          address: res.data.address,
        });
      } else {
        const code = res.error?.errors[0]?.code as string;
        toast.error(t("apiErrors." + code));
        navigate("/readers");
      }
    })();
  }, [isEditMode, readerId]);

  const validatePhoneNumber = (phone: string) => {
    if (!phone) {
      return t("readers.fields.phone") + " " + t("readers.form.errors.required");
    }
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, "");
    // Phone should have at least 10 digits (international format can have more)
    if (digitsOnly.length < 10) {
      return t("readers.form.errors.phone-invalid");
    }
    // Phone should not have more than 15 digits (E.164 standard)
    if (digitsOnly.length > 15) {
      return t("readers.form.errors.phone-invalid");
    }
    return true;
  };

  const onSubmit = async (data: ReaderDTO) => {
    if (isEditMode && readerId) {
      const res = await updateReader(parseInt(readerId), data);
      if (res.success) {
        toast.success(t("readers.messages.update-success"));
        navigate("/readers");
      } else {
        const code = res.error?.errors[0]?.code as string;
        toast.error(t("apiErrors." + code));
      }
    } else {
      const res = await addReader(data);
      if (res.success) {
        toast.success(t("readers.messages.add-success"));
        navigate("/readers");
      } else {
        const code = res.error?.errors[0]?.code as string;
        toast.error(t("apiErrors." + code));
      }
    }
  };

  if (isLoadingDetails) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode
              ? t("readers.form.editTitle")
              : t("readers.form.addTitle")}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? t("readers.form.editSubtitle")
              : t("readers.form.addSubtitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t("readers.form.sections.personalInfo")}
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("readers.fields.fullName")} *
                </label>
                <input
                  type="text"
                  {...register("fullName", {
                    required: t("readers.fields.fullName") + " " + t("readers.form.errors.required"),
                  })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t("readers.form.sections.contactInfo")}
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("readers.fields.phone")} *
                </label>
                <input
                  type="tel"
                  {...register("phone", {
                    validate: validatePhoneNumber,
                  })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("readers.fields.address")} *
                </label>
                <input
                  type="text"
                  {...register("address", {
                    required: t("readers.fields.address") + " " + t("readers.form.errors.required"),
                  })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex gap-3">
            <button
              type="submit"
              disabled={isAdding || isUpdating}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
            >
              {isAdding || isUpdating
                ? t("common.saving")
                : isEditMode
                ? t("common.update")
                : t("common.create")}
            </button>

            <button
              type="button"
              onClick={() => navigate("/readers")}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
            >
              {t("common.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReaderFormPage;
