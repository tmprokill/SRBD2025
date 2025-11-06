// features/books/pages/BookDetailsPage.tsx

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useGetBookDetails } from "../hooks/useBooks";
import { BookDetailsResponse } from "../services/bookApiService";
import { useNavigate, useParams } from "react-router";

function BookDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const { getBookDetails, isLoading } = useGetBookDetails();

  const [book, setBook] = useState<BookDetailsResponse | null>(null);

  useEffect(() => {
    if (bookId) {
      loadBookDetails(parseInt(bookId));
    }
  }, [bookId]);

  const loadBookDetails = async (id: number) => {
    const res = await getBookDetails(id);
    if (res.success && res.data) {
      setBook(res.data);
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
      navigate("/books");
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

  if (!book) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/books")}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            <span>←</span> {t("common.back")}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("books.details.title")}
          </h1>
          <p className="text-gray-600 mt-1">{t("books.details.subtitle")}</p>
        </div>

        {/* Book Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t("books.details.basicInfo")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("books.fields.title")}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{book.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("books.fields.price")}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    ${book.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("books.fields.quantity")}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{book.quantity}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("books.fields.bookId")}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{book.bookID}</p>
                </div>
              </div>
            </div>

            {/* Author Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t("books.details.authorInfo")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("books.fields.authorId")}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{book.authorID}</p>
                </div>
                {book.author && (
                  <>
                    {book.author.pseudonym && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {t("books.fields.pseudonym")}
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {book.author.pseudonym}
                        </p>
                      </div>
                    )}
                    {book.author.firstName && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {t("books.fields.firstName")}
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {book.author.firstName}
                        </p>
                      </div>
                    )}
                    {book.author.lastName && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {t("books.fields.lastName")}
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {book.author.lastName}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Genre Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t("books.details.genreInfo")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("books.fields.genreId")}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{book.genreID}</p>
                </div>
                {book.genre && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t("books.fields.genreName")}
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {book.genre.genreName}
                      </p>
                    </div>
                    {book.genre.description && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {t("books.fields.genreDescription")}
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {book.genre.description}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            {book.description && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("books.fields.description")}
                </h2>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {book.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate(`/books/edit/${book.bookID}`)}
                className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 font-medium"
              >
                {t("books.actions.edit")}
              </button>
              <button
                onClick={() => navigate("/books")}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
              >
                {t("common.back")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetailsPage;

