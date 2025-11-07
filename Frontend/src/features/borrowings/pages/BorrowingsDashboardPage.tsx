import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  useGetBorrowings,
  useFinalizeBorrowing,
} from "../hooks/useBorrowings";
import { BorrowingResponse } from "../services/borrowingApiService";
import { useNavigate } from "react-router";
import { useGetReaders } from "../../readers/hooks/useReaders";
import { useGetBooks } from "../../books/hooks/useBooks";
import { ReaderDTO } from "../../readers/services/readerApiService";
import { BookListItem } from "../../books/services/bookApiService";
import { SearchableSelect, SearchableSelectOption } from "../../../components/SearchableSelect";

function BorrowingsDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getBorrowings, isLoading: isLoadingBorrowings } = useGetBorrowings();
  const { finalizeBorrowing, isLoading: isFinalizing } = useFinalizeBorrowing();
  const { getReaders, isLoading: isLoadingReaders } = useGetReaders();
  const { getBooks, isLoading: isLoadingBooks } = useGetBooks();

  const [borrowings, setBorrowings] = useState<BorrowingResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [readers, setReaders] = useState<ReaderDTO[]>([]);
  const [books, setBooks] = useState<BookListItem[]>([]);
  const [selectedReaderName, setSelectedReaderName] = useState<string | undefined>(undefined);
  const [selectedBookTitle, setSelectedBookTitle] = useState<string | undefined>(undefined);
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
  }, [selectedReaderName, selectedBookTitle]);

  useEffect(() => {
    loadBorrowings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedReaderName, selectedBookTitle]);

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

  const loadBorrowings = async () => {
    const res = await getBorrowings(selectedReaderName, selectedBookTitle, page, pageSize);
    if (res.success && res.data) {
      setBorrowings(res.data.items);
      setTotalPages(res.data.totalPages);
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  const handleFinalize = async (borrowingId: number) => {
    if (!window.confirm(t("borrowings.messages.confirm-finalize"))) {
      return;
    }

    const res = await finalizeBorrowing(borrowingId);
    if (res.success) {
      toast.success(t("borrowings.messages.finalize-success"));
      loadBorrowings();
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
      label: `${book.title} (ID: ${book.bookID}, Available: ${book.quantity})`,
    }));
  }, [books]);

  const handleFilter = () => {
    setPage(0);
    loadBorrowings();
  };

  const handleClearFilters = () => {
    setSelectedReaderName(undefined);
    setSelectedBookTitle(undefined);
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatReturnDate = (returnDate: string | null | undefined) => {
    if (!returnDate || returnDate === null || returnDate === "" || returnDate === "0001-01-01T00:00:00") {
      return t("borrowings.table.notReturnedYet");
    }
    const date = new Date(returnDate);
    // Check if date is valid
    if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
      return t("borrowings.table.notReturnedYet");
    }
    return date.toLocaleDateString();
  };

  const isValidReturnDate = (returnDate: string | null | undefined): boolean => {
    if (!returnDate || returnDate === null || returnDate === "" || returnDate === "0001-01-01T00:00:00") {
      return false;
    }
    const returnDateObj = new Date(returnDate);
    return !isNaN(returnDateObj.getTime()) && returnDateObj.getFullYear() >= 1900;
  };

  const isOverdue = (returnDate: string | null | undefined, borrowDate: string) => {
    // If book is returned (has valid returnDate), it cannot be overdue
    if (isValidReturnDate(returnDate)) {
      return false;
    }
    
    // If book is not returned, check if it's overdue based on borrow date (30 days)
    if (!borrowDate) return false;
    
    const borrowDateObj = new Date(borrowDate);
    if (isNaN(borrowDateObj.getTime())) return false;
    
    const daysSinceBorrow = Math.floor((new Date().getTime() - borrowDateObj.getTime()) / (1000 * 60 * 60 * 24));
    const borrowingPeriodDays = 30; 
    
    return daysSinceBorrow > borrowingPeriodDays;
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("borrowings.title")}
          </h1>
          <p className="text-gray-600 mt-1">{t("borrowings.subtitle")}</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {t("borrowings.filters.title")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("borrowings.filters.readerName")}
              </label>
              <SearchableSelect
                options={readerOptions}
                value={selectedReaderName}
                onChange={(value) => setSelectedReaderName(value as string)}
                placeholder={t("borrowings.filters.readerNamePlaceholder")}
                disabled={isLoadingReaders}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("borrowings.filters.bookTitle")}
              </label>
              <SearchableSelect
                options={bookOptions}
                value={selectedBookTitle}
                onChange={(value) => setSelectedBookTitle(value as string)}
                placeholder={t("borrowings.filters.bookTitlePlaceholder")}
                disabled={isLoadingBooks}
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleFilter}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                {t("borrowings.filters.apply")}
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
              >
                {t("borrowings.filters.clear")}
              </button>
            </div>
          </div>
        </div>

        {/* Add New Borrowing Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/borrowings/add")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm"
          >
            {t("borrowings.actions.addNew")}
          </button>
        </div>

        {/* Borrowings Table */}
        {isLoadingBorrowings ? (
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
                    {t("borrowings.table.id")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("borrowings.table.reader")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("borrowings.table.book")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("borrowings.table.borrowDate")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("borrowings.table.returnDate")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("borrowings.table.quantity")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("borrowings.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borrowings.map((borrowing, index) => (
                  <tr
                    key={borrowing.borrowID || index}
                    className={`hover:bg-gray-50 ${
                      !isValidReturnDate(borrowing.returnDate) && isOverdue(borrowing.returnDate, borrowing.borrowDate) ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {borrowing.borrowID}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {borrowing.reader?.fullName || `ID: ${borrowing.readerID}`}
                      </div>
                      {borrowing.reader?.phone && (
                        <div className="text-xs text-gray-500">
                          {borrowing.reader.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {borrowing.book?.title || `ID: ${borrowing.bookID}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(borrowing.borrowDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${
                          !borrowing.returnDate
                            ? isOverdue(borrowing.returnDate, borrowing.borrowDate)
                              ? "text-red-600 font-semibold"
                              : "text-blue-600 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {formatReturnDate(borrowing.returnDate)}
                        {!borrowing.returnDate && isOverdue(borrowing.returnDate, borrowing.borrowDate) && (
                          <span className="ml-2 text-xs">({t("borrowings.table.overdue")})</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {borrowing.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {isValidReturnDate(borrowing.returnDate) ? (
                        <span className="text-xs text-gray-500 italic">
                          {t("borrowings.table.returned")}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleFinalize(borrowing.borrowID)}
                          disabled={isFinalizing}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-xs"
                        >
                          {t("borrowings.actions.finalize")}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {borrowings.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {t("borrowings.messages.noBorrowings")}
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
      </div>
    </div>
  );
}

export default BorrowingsDashboardPage;

