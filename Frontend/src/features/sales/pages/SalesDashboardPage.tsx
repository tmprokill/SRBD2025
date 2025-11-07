import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  useGetSales,
  useDeleteSale,
  useGetSalesLogs,
} from "../hooks/useSales";
import { SaleResponse, SalesLogResponse } from "../services/salesApiService";
import { useNavigate } from "react-router";
import { useGetReaders } from "../../readers/hooks/useReaders";
import { useGetBooks } from "../../books/hooks/useBooks";
import { ReaderDTO } from "../../readers/services/readerApiService";
import { BookListItem } from "../../books/services/bookApiService";
import { SearchableSelect, SearchableSelectOption } from "../../../components/SearchableSelect";

type ViewMode = "sales" | "logs";

function SalesDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getSales, isLoading: isLoadingSales } = useGetSales();
  const { deleteSale, isLoading: isDeleting } = useDeleteSale();
  const { getSalesLogs, isLoading: isLoadingLogs } = useGetSalesLogs();
  const { getReaders, isLoading: isLoadingReaders } = useGetReaders();
  const { getBooks, isLoading: isLoadingBooks } = useGetBooks();

  const [viewMode, setViewMode] = useState<ViewMode>("sales");
  const [sales, setSales] = useState<SaleResponse[]>([]);
  const [logs, setLogs] = useState<SalesLogResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [readers, setReaders] = useState<ReaderDTO[]>([]);
  const [books, setBooks] = useState<BookListItem[]>([]);
  const [selectedReaderName, setSelectedReaderName] = useState<string | undefined>(undefined);
  const [selectedBookTitle, setSelectedBookTitle] = useState<string | undefined>(undefined);
  const [selectedSaleId, setSelectedSaleId] = useState<number | undefined>(undefined);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    loadReaders();
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset page to 0 when filters change
  useEffect(() => {
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReaderName, selectedBookTitle, selectedSaleId, fromDate, toDate, viewMode]);

  useEffect(() => {
    if (viewMode === "sales") {
      loadSales();
    } else {
      loadLogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedReaderName, selectedBookTitle, viewMode, selectedSaleId, fromDate, toDate]);

  const loadReaders = async () => {
    const res = await getReaders();
    if (res.success && res.data) {
      setReaders(res.data);
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  const loadBooks = async () => {
    const res = await getBooks();
    if (res.success && res.data) {
      setBooks(res.data);
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  const loadSales = async () => {
    const res = await getSales(selectedReaderName, selectedBookTitle, page, pageSize);
    if (res.success && res.data) {
      setSales(res.data.items);
      setTotalPages(res.data.totalPages);
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  const loadLogs = async () => {
    const res = await getSalesLogs(
      selectedSaleId,
      fromDate || undefined,
      toDate || undefined,
      page,
      pageSize
    );
    if (res.success && res.data) {
      setLogs(res.data);
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  const handleDelete = async (saleId: number) => {
    if (!window.confirm(t("sales.messages.confirm-delete"))) {
      return;
    }

    const res = await deleteSale(saleId);
    if (res.success) {
      toast.success(t("sales.messages.delete-success"));
      loadSales();
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  const readerOptions: SearchableSelectOption[] = useMemo(() => {
    return readers.map((reader) => ({
      value: reader.fullName,
      label: `${reader.fullName} (${reader.phone})`,
    }));
  }, [readers]);

  const bookOptions: SearchableSelectOption[] = useMemo(() => {
    return books.map((book) => ({
      value: book.title,
      label: `${book.title} (ID: ${book.bookID})`,
    }));
  }, [books]);

  const handleFilter = () => {
    setPage(0);
    if (viewMode === "sales") {
      loadSales();
    } else {
      loadLogs();
    }
  };

  const handleClearFilters = () => {
    setSelectedReaderName(undefined);
    setSelectedBookTitle(undefined);
    setSelectedSaleId(undefined);
    setFromDate("");
    setToDate("");
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("sales.title")}
          </h1>
          <p className="text-gray-600 mt-1">{t("sales.subtitle")}</p>
        </div>

        {/* View Mode Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => {
              setViewMode("sales");
              setPage(0);
            }}
            className={`px-4 py-2 font-medium transition-colors ${
              viewMode === "sales"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("sales.tabs.sales")}
          </button>
          <button
            onClick={() => {
              setViewMode("logs");
              setPage(0);
            }}
            className={`px-4 py-2 font-medium transition-colors ${
              viewMode === "logs"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("sales.tabs.logs")}
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {t("sales.filters.title")}
          </h3>
          {viewMode === "sales" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("sales.filters.readerName")}
                </label>
                <SearchableSelect
                  options={readerOptions}
                  value={selectedReaderName}
                  onChange={(value) => setSelectedReaderName(value as string)}
                  placeholder={t("sales.filters.readerNamePlaceholder")}
                  disabled={isLoadingReaders}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("sales.filters.bookTitle")}
                </label>
                <SearchableSelect
                  options={bookOptions}
                  value={selectedBookTitle}
                  onChange={(value) => setSelectedBookTitle(value as string)}
                  placeholder={t("sales.filters.bookTitlePlaceholder")}
                  disabled={isLoadingBooks}
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={handleFilter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  {t("sales.filters.apply")}
                </button>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
                >
                  {t("sales.filters.clear")}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("sales.filters.saleId")}
                </label>
                <input
                  type="number"
                  value={selectedSaleId || ""}
                  onChange={(e) =>
                    setSelectedSaleId(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  placeholder={t("sales.filters.saleIdPlaceholder")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("sales.filters.fromDate")}
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("sales.filters.toDate")}
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={handleFilter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  {t("sales.filters.apply")}
                </button>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
                >
                  {t("sales.filters.clear")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add New Sale Button */}
        {viewMode === "sales" && (
          <div className="mb-6">
            <button
              onClick={() => navigate("/sales/add")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm"
            >
              {t("sales.actions.addNew")}
            </button>
          </div>
        )}

        {/* Sales Table */}
        {viewMode === "sales" && (
          <>
            {isLoadingSales ? (
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
                        {t("sales.table.id")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("sales.table.reader")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("sales.table.book")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("sales.table.saleDate")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("sales.table.quantity")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("sales.table.price")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("sales.table.total")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("sales.table.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sales.map((sale, index) => (
                      <tr
                        key={sale.saleID || index}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {sale.saleID}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {sale.reader?.fullName || `ID: ${sale.readerID}`}
                          </div>
                          {sale.reader?.phone && (
                            <div className="text-xs text-gray-500">
                              {sale.reader.phone}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {sale.book?.title || `ID: ${sale.bookID}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(sale.saleDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {sale.quantity}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            ${sale.price.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            ${(sale.price * sale.quantity).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/sales/edit/${sale.saleID}`)}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              {t("sales.actions.edit")}
                            </button>
                            <button
                              onClick={() => handleDelete(sale.saleID)}
                              disabled={isDeleting}
                              className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                            >
                              {t("sales.actions.delete")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {sales.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    {t("sales.messages.noSales")}
                  </div>
                )}

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 font-medium"
                  >
                    {t("common.previous")}
                  </button>
                  <span className="text-sm text-gray-600">
                    {t("common.page")} {page + 1} {t("common.of")} {totalPages || 1}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page + 1 >= totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 font-medium"
                  >
                    {t("common.next")}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Sales Logs Table */}
        {viewMode === "logs" && (
          <>
            {isLoadingLogs ? (
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
                        {t("sales.logs.table.id")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("sales.logs.table.saleId")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("sales.logs.table.newQuantity")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("sales.logs.table.newPrice")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("sales.logs.table.modifyDate")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log, index) => (
                      <tr key={log.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {log.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {log.saleID}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {log.newQuantity}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            ${log.newPrice.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDateTime(log.modifyDate)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {logs.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    {t("sales.logs.messages.noLogs")}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SalesDashboardPage;

