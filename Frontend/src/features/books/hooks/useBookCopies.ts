import { useState } from "react";
import {
  BookCopyApiService,
  BookCopyResponse,
} from "../services/bookCopyApiService";
import { ApiResponse, ProblemDetails } from "../../../core/api/types";

export const useGetBookCopies = () => {
  const bookCopyService = new BookCopyApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBookCopies = async (): Promise<ApiResponse<BookCopyResponse[]>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await bookCopyService.getBookCopiesAsync();
      if (!res.success) {
        setError(res.error?.errors[0].code ?? null);
      }
      return res;
    } catch (e) {
      const err = e as ProblemDetails;
      setError(err.errors[0].code);
      return {
        success: false,
        data: undefined,
        error: err,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { getBookCopies, isLoading, error };
};

