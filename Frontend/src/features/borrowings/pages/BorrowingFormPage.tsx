import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { useAddBorrowing } from "../hooks/useBorrowings";
import { BorrowingDTO } from "../services/borrowingApiService";
import { useGetReaders } from "../../readers/hooks/useReaders";
import { useGetBooks } from "../../books/hooks/useBooks";
import { ReaderDTO } from "../../readers/services/readerApiService";
import { BookListItem } from "../../books/services/bookApiService";
import { useNavigate } from "react-router";
import { SearchableSelect, SearchableSelectOption } from "../../../components/SearchableSelect";

function BorrowingFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addBorrowing, isLoading: isAdding } = useAddBorrowing();
  const { getReaders, isLoading: isLoadingReaders } = useGetReaders();
  const { getBooks, isLoading: isLoadingBooks } = useGetBooks();

  const [readers, setReaders] = useState<ReaderDTO[]>([]);
  const [books, setBooks] = useState<BookListItem[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<BorrowingDTO>({
    defaultValues: {
      readerID: 0,
      bookID: 0,
      quantity: 1,
    },
  });

  const selectedBookID = watch("bookID");

  useEffect(() => {
    loadReaders();
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const loadBooks = async () => {
    const res = await getBooks();
    if (res.success && res.data) {
      setBooks(res.data);
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  const readerOptions: SearchableSelectOption[] = useMemo(() => {
    return readers.map((reader) => ({
      value: reader.readerID!,
      label: `${reader.fullName} (${reader.phone})`,
    }));
  }, [readers]);

  const bookOptions: SearchableSelectOption[] = useMemo(() => {
    return books.map((book) => ({
      value: book.bookID,
      label: `${book.title} (ID: ${book.bookID}, Available: ${book.quantity})`,
    }));
  }, [books]);

  const getSelectedBook = (bookID: number) => {
    return books.find((b) => b.bookID === bookID);
  };

  const onSubmit = async (data: BorrowingDTO) => {
    if (data.readerID === 0 || data.bookID === 0) {
      toast.warning(t("borrowings.form.errors.selectRequired"));
      return;
    }

    // Pre-check quantity before submitting
    const selectedBook = getSelectedBook(data.bookID);
    if (selectedBook && data.quantity > selectedBook.quantity) {
      toast.error(
        t("borrowings.form.errors.quantityExceedsAvailable", {
          available: selectedBook.quantity,
        })
      );
      return;
    }

    const res = await addBorrowing(data);
    if (res.success) {
      toast.success(t("borrowings.messages.add-success"));
      navigate("/borrowings");
    } else {
      const code = res.error?.errors[0]?.code as string;
      // Try to get translation, fallback to error detail if not found
      const errorTranslationKey = "apiErrors." + code;
      let errorMessage = t(errorTranslationKey, { defaultValue: "" });
      
      // If translation not found, use description or detail from error
      if (!errorMessage || errorMessage === errorTranslationKey) {
        errorMessage = res.error?.errors[0]?.description || res.error?.detail || t("apiErrors.common.APPLICATION_ERROR");
      }
      
      toast.error(errorMessage);
    }
  };

  if (isLoadingReaders || isLoadingBooks) {
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
            {t("borrowings.form.addTitle")}
          </h1>
          <p className="text-gray-600 mt-1">
            {t("borrowings.form.addSubtitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="space-y-6">
            {/* Reader Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("borrowings.form.reader")} *
              </label>
              <Controller
                name="readerID"
                control={control}
                rules={{
                  required: t("borrowings.form.errors.readerRequired"),
                  validate: (value) =>
                    value !== 0 || t("borrowings.form.errors.readerRequired"),
                }}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    options={readerOptions}
                    placeholder={t("borrowings.form.readerPlaceholder")}
                  />
                )}
              />
              {errors.readerID && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.readerID.message}
                </p>
              )}
            </div>

            {/* Book Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("borrowings.form.book")} *
              </label>
              <Controller
                name="bookID"
                control={control}
                rules={{
                  required: t("borrowings.form.errors.bookRequired"),
                  validate: (value) =>
                    value !== 0 || t("borrowings.form.errors.bookRequired"),
                }}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    options={bookOptions}
                    placeholder={t("borrowings.form.bookPlaceholder")}
                  />
                )}
              />
              {errors.bookID && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.bookID.message}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("borrowings.form.quantity")} *
                {selectedBookID > 0 && (
                  <span className="ml-2 text-sm text-gray-500 font-normal">
                    ({t("borrowings.form.available")}: {getSelectedBook(selectedBookID)?.quantity || 0})
                  </span>
                )}
              </label>
              <input
                type="number"
                min="1"
                max={selectedBookID > 0 ? getSelectedBook(selectedBookID)?.quantity : undefined}
                {...register("quantity", {
                  required: t("borrowings.form.errors.quantityRequired"),
                  min: {
                    value: 1,
                    message: t("borrowings.form.errors.quantityMin"),
                  },
                  validate: (value) => {
                    if (selectedBookID > 0) {
                      const selectedBook = getSelectedBook(selectedBookID);
                      if (selectedBook && value > selectedBook.quantity) {
                        return t("borrowings.form.errors.quantityExceedsAvailable", {
                          available: selectedBook.quantity,
                        });
                      }
                    }
                    return true;
                  },
                })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={isAdding}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 font-medium"
            >
              {t("borrowings.form.submit")}
            </button>
            <button
              type="button"
              onClick={() => navigate("/borrowings")}
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

export default BorrowingFormPage;

