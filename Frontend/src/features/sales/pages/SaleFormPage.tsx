import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { useAddSale, useUpdateSale, useGetSaleDetails } from "../hooks/useSales";
import { SaleDTO } from "../services/salesApiService";
import { useGetReaders } from "../../readers/hooks/useReaders";
import { useGetBooks } from "../../books/hooks/useBooks";
import { ReaderDTO } from "../../readers/services/readerApiService";
import { BookListItem } from "../../books/services/bookApiService";
import { useNavigate, useParams } from "react-router";
import { SearchableSelect, SearchableSelectOption } from "../../../components/SearchableSelect";

function SaleFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { saleId } = useParams<{ saleId: string }>();
  const isEditMode = !!saleId;
  
  const { addSale, isLoading: isAdding } = useAddSale();
  const { updateSale, isLoading: isUpdating } = useUpdateSale();
  const { getSaleDetails, isLoading: isLoadingDetails } = useGetSaleDetails();
  const { getReaders, isLoading: isLoadingReaders } = useGetReaders();
  const { getBooks, isLoading: isLoadingBooks } = useGetBooks();

  const [readers, setReaders] = useState<ReaderDTO[]>([]);
  const [books, setBooks] = useState<BookListItem[]>([]);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    reset,
  } = useForm<SaleDTO>({
    defaultValues: {
      readerID: 0,
      bookID: 0,
      quantity: 1,
      price: 0,
      saleDate: undefined,
    },
  });

  const selectedBookID = watch("bookID");
  const selectedPrice = watch("price");
  const selectedQuantity = watch("quantity");

  useEffect(() => {
    loadReaders();
    loadBooks();
    if (isEditMode && saleId) {
      loadSaleDetails(parseInt(saleId));
    } else {
      // Set sale date to today when adding (not editing)
      setValue("saleDate", getTodayDate());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saleId, isEditMode]);

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

  const loadSaleDetails = async (id: number) => {
    const res = await getSaleDetails(id);
    if (res.success && res.data) {
      const sale = res.data;
      reset({
        readerID: sale.readerID,
        bookID: sale.bookID,
        quantity: sale.quantity,
        price: sale.price,
        saleDate: sale.saleDate ? sale.saleDate.split("T")[0] : undefined,
      });
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
      navigate("/sales");
    }
  };

  // Update price when book is selected
  useEffect(() => {
    if (selectedBookID > 0 && !isEditMode) {
      const selectedBook = getSelectedBook(selectedBookID);
      if (selectedBook) {
        setValue("price", selectedBook.price);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBookID, isEditMode]);

  const readerOptions: SearchableSelectOption[] = useMemo(() => {
    return readers.map((reader) => ({
      value: reader.readerID!,
      label: `${reader.fullName} (${reader.phone})`,
    }));
  }, [readers]);

  const bookOptions: SearchableSelectOption[] = useMemo(() => {
    return books.map((book) => ({
      value: book.bookID,
      label: `${book.title} (ID: ${book.bookID}, Price: $${book.price.toFixed(2)}, Available: ${book.quantity})`,
    }));
  }, [books]);

  const getSelectedBook = (bookID: number) => {
    return books.find((b) => b.bookID === bookID);
  };

  const onSubmit = async (data: SaleDTO) => {
    if (data.readerID === 0 || data.bookID === 0) {
      toast.warning(t("sales.form.errors.selectRequired"));
      return;
    }

    // For add mode, ensure price is set from book and date is set to today
    if (!isEditMode) {
      const selectedBook = getSelectedBook(data.bookID);
      if (!selectedBook) {
        toast.error(t("sales.form.errors.bookRequired"));
        return;
      }
      data.price = selectedBook.price;
      data.saleDate = getTodayDate();
    }

    if (data.price <= 0) {
      toast.error(t("sales.form.errors.priceInvalid"));
      return;
    }

    // Format saleDate if provided
    const saleData: SaleDTO = {
      ...data,
      saleDate: data.saleDate || undefined,
    };

    const res = isEditMode && saleId
      ? await updateSale(parseInt(saleId), saleData)
      : await addSale(saleData);

    if (res.success) {
      toast.success(
        isEditMode
          ? t("sales.messages.update-success")
          : t("sales.messages.add-success")
      );
      navigate("/sales");
    } else {
      const code = res.error?.errors[0]?.code as string;
      const errorTranslationKey = "apiErrors." + code;
      let errorMessage = t(errorTranslationKey, { defaultValue: "" });

      if (!errorMessage || errorMessage === errorTranslationKey) {
        errorMessage =
          res.error?.errors[0]?.description ||
          res.error?.detail ||
          t("apiErrors.common.APPLICATION_ERROR");
      }

      toast.error(errorMessage);
    }
  };

  if (isLoadingReaders || isLoadingBooks || isLoadingDetails) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  const totalAmount = selectedPrice * selectedQuantity;

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode
              ? t("sales.form.editTitle")
              : t("sales.form.addTitle")}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? t("sales.form.editSubtitle")
              : t("sales.form.addSubtitle")}
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
                {t("sales.form.reader")} *
              </label>
              <Controller
                name="readerID"
                control={control}
                rules={{
                  required: t("sales.form.errors.readerRequired"),
                  validate: (value) =>
                    value !== 0 || t("sales.form.errors.readerRequired"),
                }}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    options={readerOptions}
                    placeholder={t("sales.form.readerPlaceholder")}
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
                {t("sales.form.book")} *
              </label>
              <Controller
                name="bookID"
                control={control}
                rules={{
                  required: t("sales.form.errors.bookRequired"),
                  validate: (value) =>
                    value !== 0 || t("sales.form.errors.bookRequired"),
                }}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    options={bookOptions}
                    placeholder={t("sales.form.bookPlaceholder")}
                  />
                )}
              />
              {errors.bookID && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.bookID.message}
                </p>
              )}
            </div>

            {/* Sale Date - Hidden for add mode, visible for edit mode */}
            {isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("sales.form.saleDate")}
                </label>
                <input
                  type="date"
                  {...register("saleDate")}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.saleDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.saleDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.saleDate.message}
                  </p>
                )}
              </div>
            )}
            {!isEditMode && (
              <input type="hidden" {...register("saleDate")} />
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("sales.form.quantity")} *
                {selectedBookID > 0 && (
                  <span className="ml-2 text-sm text-gray-500 font-normal">
                    ({t("sales.form.available")}: {getSelectedBook(selectedBookID)?.quantity || 0})
                  </span>
                )}
              </label>
              <input
                type="number"
                min="1"
                max={selectedBookID > 0 ? getSelectedBook(selectedBookID)?.quantity : undefined}
                {...register("quantity", {
                  required: t("sales.form.errors.quantityRequired"),
                  min: {
                    value: 1,
                    message: t("sales.form.errors.quantityMin"),
                  },
                  validate: (value) => {
                    if (selectedBookID > 0) {
                      const selectedBook = getSelectedBook(selectedBookID);
                      if (selectedBook && value > selectedBook.quantity) {
                        return t("sales.form.errors.quantityExceedsAvailable", {
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

            {/* Price - Hidden for add mode, visible for edit mode */}
            {isEditMode ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("sales.form.price")} *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register("price", {
                    required: t("sales.form.errors.priceRequired"),
                    min: {
                      value: 0.01,
                      message: t("sales.form.errors.priceMin"),
                    },
                  })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.price.message}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("sales.form.price")}
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {selectedBookID > 0
                    ? `$${getSelectedBook(selectedBookID)?.price.toFixed(2) || "0.00"}`
                    : t("sales.form.selectBookFirst")}
                </div>
                <input type="hidden" {...register("price")} />
              </div>
            )}

            {/* Total Amount Display */}
            {selectedPrice > 0 && selectedQuantity > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium">
                  {t("sales.form.totalAmount")}
                </p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  ${totalAmount.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={isAdding || isUpdating}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 font-medium"
            >
              {isEditMode ? t("sales.form.update") : t("sales.form.submit")}
            </button>
            <button
              type="button"
              onClick={() => navigate("/sales")}
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

export default SaleFormPage;

