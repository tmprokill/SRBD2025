import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useAddBook,
  useUpdateBook,
  useGetBookDetails,
} from "../hooks/useBooks";
import { useGetAuthors } from "../hooks/useAuthors";
import { useGetGenres } from "../hooks/useGenres";
import { AuthorListItem } from "../services/authorApiService";
import { GenreListItem } from "../services/genreApiService";
import { BookDTO } from "../services/bookApiService";
import { useNavigate, useParams } from "react-router";
import { SearchableSelect, SearchableSelectOption } from "../../../components/SearchableSelect";

function BookFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const isEditMode = !!bookId;

  const { addBook, isLoading: isAdding } = useAddBook();
  const { updateBook, isLoading: isUpdating } = useUpdateBook();
  const { getBookDetails, isLoading: isLoadingDetails } =
    useGetBookDetails();
  const { getAuthors, isLoading: isLoadingAuthors } = useGetAuthors();
  const { getGenres, isLoading: isLoadingGenres } = useGetGenres();

  const [authors, setAuthors] = useState<AuthorListItem[]>([]);
  const [genres, setGenres] = useState<GenreListItem[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<BookDTO>({
    defaultValues: {
      title: "",
      authorID: 0,
      genreID: 0,
      price: 0,
      quantity: 0,
      description: "",
    },
  });

  useEffect(() => {
    loadAuthors();
    loadGenres();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAuthors = async () => {
    const res = await getAuthors();
    if (res.success && res.data) {
      setAuthors(res.data);
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  const loadGenres = async () => {
    const res = await getGenres();
    if (res.success && res.data) {
      setGenres(res.data);
    } else {
      const code = res.error?.errors[0]?.code as string;
      toast.error(t("apiErrors." + code));
    }
  };

  const authorOptions: SearchableSelectOption[] = useMemo(() => {
    return authors.map((author) => {
      const label = author.pseudonym
        ? `${author.pseudonym} (${author.firstName} ${author.lastName})`
        : `${author.firstName} ${author.lastName}`;
      return {
        value: author.authorID,
        label: label,
      };
    });
  }, [authors]);

  const genreOptions: SearchableSelectOption[] = useMemo(() => {
    return genres.map((genre) => ({
      value: genre.genreID,
      label: genre.genreName,
    }));
  }, [genres]);

  useEffect(() => {
    if (!isEditMode || !bookId) return;
    (async () => {
      const res = await getBookDetails(parseInt(bookId));
      if (res.success && res.data) {
        reset({
          title: res.data.title,
          authorID: res.data.authorID,
          genreID: res.data.genreID,
          price: res.data.price,
          quantity: res.data.quantity,
          description: res.data.description || "",
        });
      } else {
        const code = res.error?.errors[0]?.code as string;
        toast.error(t("apiErrors." + code));
        navigate("/books");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, bookId]);

  const validatePrice = (price: number) => {
    if (price < 0) {
      return t("books.form.errors.price-negative");
    }
    return true;
  };

  const validateQuantity = (quantity: number) => {
    if (quantity < 0) {
      return t("books.form.errors.quantity-negative");
    }
    if (!Number.isInteger(quantity)) {
      return t("books.form.errors.quantity-integer");
    }
    return true;
  };

  const validateAuthorId = (authorID: number) => {
    if (authorID <= 0) {
      return t("books.form.errors.authorId-required");
    }
    return true;
  };

  const validateGenreId = (genreID: number) => {
    if (genreID <= 0) {
      return t("books.form.errors.genreId-required");
    }
    return true;
  };

  const onSubmit = async (data: BookDTO) => {
    if (isEditMode && bookId) {
      const res = await updateBook(parseInt(bookId), data);
      if (res.success) {
        toast.success(t("books.messages.update-success"));
        navigate("/books");
      } else {
        const code = res.error?.errors[0]?.code as string;
        toast.error(t("apiErrors." + code));
      }
    } else {
      const res = await addBook(data);
      if (res.success) {
        toast.success(t("books.messages.add-success"));
        navigate("/books");
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
              ? t("books.form.editTitle")
              : t("books.form.addTitle")}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? t("books.form.editSubtitle")
              : t("books.form.addSubtitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t("books.form.sections.basicInfo")}
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("books.fields.title")} *
                </label>
                <input
                  type="text"
                  {...register("title", {
                    required:
                      t("books.fields.title") +
                      " " +
                      t("books.form.errors.required"),
                  })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("books.fields.author")} *
                </label>
                <Controller
                  name="authorID"
                  control={control}
                  rules={{
                    required: true,
                    validate: validateAuthorId,
                  }}
                  render={({ field }) => (
                    <SearchableSelect
                      options={authorOptions}
                      value={field.value || undefined}
                      onChange={(value) => {
                        field.onChange(value);
                        setValue("authorID", value as number, {
                          shouldValidate: true,
                        });
                      }}
                      placeholder={t("books.form.selectAuthor")}
                      error={!!errors.authorID}
                      disabled={isLoadingAuthors}
                    />
                  )}
                />
                {errors.authorID && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.authorID.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("books.fields.genre")} *
                </label>
                <Controller
                  name="genreID"
                  control={control}
                  rules={{
                    required: true,
                    validate: validateGenreId,
                  }}
                  render={({ field }) => (
                    <SearchableSelect
                      options={genreOptions}
                      value={field.value || undefined}
                      onChange={(value) => {
                        field.onChange(value);
                        setValue("genreID", value as number, {
                          shouldValidate: true,
                        });
                      }}
                      placeholder={t("books.form.selectGenre")}
                      error={!!errors.genreID}
                      disabled={isLoadingGenres}
                    />
                  )}
                />
                {errors.genreID && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.genreID.message}
                  </p>
                )}
              </div>
            </div>

            {/* Pricing and Inventory */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t("books.form.sections.pricingInventory")}
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("books.fields.price")} *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price", {
                    required: true,
                    valueAsNumber: true,
                    validate: validatePrice,
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("books.fields.quantity")} *
                </label>
                <input
                  type="number"
                  {...register("quantity", {
                    required: true,
                    valueAsNumber: true,
                    validate: validateQuantity,
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

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t("books.form.sections.description")}
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("books.fields.description")}
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
              onClick={() => navigate("/books")}
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

export default BookFormPage;

