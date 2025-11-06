// features/readers/pages/ReadersDashboardPage.tsx

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  useGetReaders,
  useDeleteReader,
  useCountReadersFromCity,
} from "../hooks/useReaders";
import { ReaderDTO } from "../services/readerApiService";
import { useNavigate } from "react-router";

function ReadersDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getReaders, isLoading: isLoadingReaders } = useGetReaders();
  const { deleteReader, isLoading: isDeleting } = useDeleteReader();
  const { countReadersFromCity, isLoading: isLoadingCount } =
    useCountReadersFromCity();

  const [readers, setReaders] = useState<ReaderDTO[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");

  useEffect(() => {
    loadReaders();
  }, []);

  const loadReaders = async () => {
    const res = await getReaders();
    if (res.success && res.data) {
      setReaders(res.data);
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  const handleDelete = async (readerId: number) => {
    if (!window.confirm(t("readers.messages.confirm-delete"))) {
      return;
    }

    const res = await deleteReader(readerId);
    if (res.success) {
      toast.success(t("readers.messages.delete-success"));
      loadReaders();
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  const handleCountCity = async () => {
    if (!selectedCity.trim()) {
      toast.warning(t("readers.messages.enter-city"));
      return;
    }

    const res = await countReadersFromCity(selectedCity);
    if (res.success) {
      toast.success(
        t("readers.messages.count-success", {
          count: res.data,
          city: selectedCity,
        })
      );
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with City Counter */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("readers.title")}
            </h1>
            <p className="text-gray-600 mt-1">{t("readers.subtitle")}</p>
          </div>

          {/* City Counter Widget */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("readers.cityCounter.label")}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                placeholder={t("readers.cityCounter.placeholder")}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCountCity}
                disabled={isLoadingCount}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
              >
                {t("readers.cityCounter.button")}
              </button>
            </div>
          </div>
        </div>

        {/* Add New Reader Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/readers/add")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm"
          >
            {t("readers.actions.addNew")}
          </button>
        </div>

        {/* Readers Table */}
        {isLoadingReaders ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">{t("common.loading")}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("readers.table.name")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("readers.table.phone")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("readers.table.address")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("readers.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {readers.map((reader, index) => (
                  <tr
                    key={reader.readerID || index}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {reader.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {reader.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {reader.address}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/readers/${reader.readerID}`)
                          }
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {t("readers.actions.view")}
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/readers/edit/${reader.readerID}`)
                          }
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          {t("readers.actions.edit")}
                        </button>
                        <button
                          onClick={() => handleDelete(reader.readerID!)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                        >
                          {t("readers.actions.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {readers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {t("readers.messages.noReaders")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReadersDashboardPage;
