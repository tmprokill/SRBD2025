// features/books/pages/BooksDashboardPage.tsx

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  useGetBooks,
  useDeleteBook,
  useUpdateBookDescriptionByPrice,
  useCutThePrice,
  useCountGreaterThanAvgPrice,
  useCountBooksMorePriceThan,
  useGetSecondPopularBook,
} from "../hooks/useBooks";
import { BookListItem } from "../services/bookApiService";
import { useNavigate } from "react-router";

function BooksDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getBooks, isLoading: isLoadingBooks } = useGetBooks();
  const { deleteBook, isLoading: isDeleting } = useDeleteBook();
  const { updateBookDescriptionByPrice, isLoading: isUpdatingDescription } =
    useUpdateBookDescriptionByPrice();
  const { cutThePrice, isLoading: isCuttingPrice } = useCutThePrice();
  const { countGreaterThanAvgPrice, isLoading: isLoadingAvgCount } =
    useCountGreaterThanAvgPrice();
  const { countBooksMorePriceThan, isLoading: isLoadingPriceCount } =
    useCountBooksMorePriceThan();
  const { getSecondPopularBook, isLoading: isLoadingPopular } =
    useGetSecondPopularBook();

  const [books, setBooks] = useState<BookListItem[]>([]);
  const [priceInput, setPriceInput] = useState<string>("");
  const [cutPricePercent, setCutPricePercent] = useState<string>("");
  const [cutPriceMinSales, setCutPriceMinSales] = useState<string>("");
  const [minTotalSold, setMinTotalSold] = useState<string>("");

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const res = await getBooks();
    if (res.success && res.data) {
      setBooks(res.data);
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  const handleDelete = async (bookId: number) => {
    if (!window.confirm(t("books.messages.confirm-delete"))) {
      return;
    }

    const res = await deleteBook(bookId);
    if (res.success) {
      toast.success(t("books.messages.delete-success"));
      loadBooks();
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  const handleUpdateDescription = async () => {
    const res = await updateBookDescriptionByPrice();
    if (res.success) {
      toast.success(t("books.messages.update-description-success"));
      loadBooks();
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  const handleCutPrice = async () => {
    const percent = parseFloat(cutPricePercent);
    const minSales = parseFloat(cutPriceMinSales);

    if (isNaN(percent) || isNaN(minSales)) {
      toast.warning(t("books.messages.invalid-input"));
      return;
    }

    const res = await cutThePrice(percent, minSales);
    if (res.success) {
      toast.success(t("books.messages.cut-price-success"));
      loadBooks();
      setCutPricePercent("");
      setCutPriceMinSales("");
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  const handleCountGreaterThanAvg = async () => {
    const res = await countGreaterThanAvgPrice();
    if (res.success) {
      toast.success(
        t("books.messages.count-avg-success", { count: res.data })
      );
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  const handleCountMorePriceThan = async () => {
    const price = parseFloat(priceInput);
    if (isNaN(price)) {
      toast.warning(t("books.messages.enter-price"));
      return;
    }

    const res = await countBooksMorePriceThan(price);
    if (res.success) {
      toast.success(
        t("books.messages.count-price-success", {
          count: res.data,
          price: price,
        })
      );
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  const handleGetSecondPopular = async () => {
    const minSold = parseInt(minTotalSold);
    if (isNaN(minSold)) {
      toast.warning(t("books.messages.enter-min-sold"));
      return;
    }

    const res = await getSecondPopularBook(minSold);
    if (res.success && res.data) {
      toast.success(
        t("books.messages.second-popular-success", {
          title: res.data.title,
          totalSold: res.data.totalSold,
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
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("books.title")}
          </h1>
          <p className="text-gray-600 mt-1">{t("books.subtitle")}</p>
        </div>

        {/* Special Operations Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Update Description by Price */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t("books.operations.updateDescription.title")}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {t("books.operations.updateDescription.description")}
            </p>
            <button
              onClick={handleUpdateDescription}
              disabled={isUpdatingDescription}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
            >
              {t("books.operations.updateDescription.button")}
            </button>
          </div>

          {/* Cut Price */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t("books.operations.cutPrice.title")}
            </h3>
            <div className="space-y-2">
              <input
                type="number"
                value={cutPricePercent}
                onChange={(e) => setCutPricePercent(e.target.value)}
                placeholder={t("books.operations.cutPrice.percentPlaceholder")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                step="0.01"
                value={cutPriceMinSales}
                onChange={(e) => setCutPriceMinSales(e.target.value)}
                placeholder={t("books.operations.cutPrice.minSalesPlaceholder")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCutPrice}
                disabled={isCuttingPrice}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 font-medium"
              >
                {t("books.operations.cutPrice.button")}
              </button>
            </div>
          </div>

          {/* Count Greater Than Avg Price */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t("books.operations.countAvg.title")}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {t("books.operations.countAvg.description")}
            </p>
            <button
              onClick={handleCountGreaterThanAvg}
              disabled={isLoadingAvgCount}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 font-medium"
            >
              {t("books.operations.countAvg.button")}
            </button>
          </div>

          {/* Count More Price Than */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t("books.operations.countPrice.title")}
            </h3>
            <div className="space-y-2">
              <input
                type="number"
                step="0.01"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder={t("books.operations.countPrice.placeholder")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCountMorePriceThan}
                disabled={isLoadingPriceCount}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 font-medium"
              >
                {t("books.operations.countPrice.button")}
              </button>
            </div>
          </div>

          {/* Get Second Popular Book */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t("books.operations.secondPopular.title")}
            </h3>
            <div className="flex gap-2">
              <input
                type="number"
                value={minTotalSold}
                onChange={(e) => setMinTotalSold(e.target.value)}
                placeholder={t("books.operations.secondPopular.placeholder")}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleGetSecondPopular}
                disabled={isLoadingPopular}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-medium"
              >
                {t("books.operations.secondPopular.button")}
              </button>
            </div>
          </div>
        </div>

        {/* Add New Book Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/books/add")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm"
          >
            {t("books.actions.addNew")}
          </button>
        </div>

        {/* Books Table */}
        {isLoadingBooks ? (
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
                    {t("books.table.title")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("books.table.author")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("books.table.genre")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("books.table.price")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("books.table.quantity")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("books.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book, index) => (
                  <tr
                    key={book.bookID || index}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {book.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {t("books.table.authorId")}: {book.authorID}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {t("books.table.genreId")}: {book.genreID}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        ${book.price.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{book.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/books/${book.bookID}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {t("books.actions.view")}
                        </button>
                        <button
                          onClick={() => navigate(`/books/edit/${book.bookID}`)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          {t("books.actions.edit")}
                        </button>
                        <button
                          onClick={() => handleDelete(book.bookID)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                        >
                          {t("books.actions.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {books.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {t("books.messages.noBooks")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BooksDashboardPage;

