// features/readers/pages/ReaderDetailsPage.tsx

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useGetReaderDetails } from "../hooks/useReaders";
import { ReaderDetailsResponse } from "../services/readerApiService";
import { useNavigate, useParams } from "react-router";

function ReaderDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { readerId } = useParams<{ readerId: string }>();
  const { getReaderDetails, isLoading } = useGetReaderDetails();

  const [reader, setReader] = useState<ReaderDetailsResponse | null>(null);

  useEffect(() => {
    if (readerId) {
      loadReaderDetails(parseInt(readerId));
    }
  }, [readerId]);

  const loadReaderDetails = async (id: number) => {
    const res = await getReaderDetails(id);
    if (res.success && res.data) {
      setReader(res.data);
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
      navigate("/readers");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!reader) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("readers.details.title")}
            </h1>
            <p className="text-gray-600 mt-1">
              {t("readers.details.subtitle")}
            </p>
          </div>
          <button
            onClick={() => navigate("/readers")}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {t("common.back")}
          </button>
        </div>

        {/* Reader Details Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <h2 className="text-2xl font-bold text-white">
              {reader.fullName}
            </h2>
            <p className="text-blue-100 mt-1">ID: {reader.readerID}</p>
          </div>

          {/* Details Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("readers.details.personalInfo")}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      {t("readers.fields.fullName")}
                    </label>
                    <p className="mt-1 text-gray-900">{reader.fullName}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("readers.details.contactInfo")}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      {t("readers.fields.phone")}
                    </label>
                    <p className="mt-1 text-gray-900">{reader.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      {t("readers.fields.address")}
                    </label>
                    <p className="mt-1 text-gray-900">{reader.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            {(reader.registrationDate || reader.borrowedBooksCount !== undefined) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("readers.details.statistics")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reader.registrationDate && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-600 font-medium">
                        {t("readers.details.registrationDate")}
                      </p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">
                        {new Date(reader.registrationDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {reader.borrowedBooksCount !== undefined && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-600 font-medium">
                        {t("readers.details.borrowedBooks")}
                      </p>
                      <p className="text-2xl font-bold text-green-900 mt-1">
                        {reader.borrowedBooksCount}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => navigate(`/readers/edit/${reader.readerID}`)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                {t("readers.actions.edit")}
              </button>
              <button
                onClick={() => navigate("/readers")}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
              >
                {t("common.cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReaderDetailsPage;