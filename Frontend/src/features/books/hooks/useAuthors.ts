import { useState } from "react";
import { AuthorApiService, AuthorListItem } from "../services/authorApiService";
import { ApiResponse, ProblemDetails } from "../../../core/api/types";

export const useGetAuthors = () => {
  const authorService = new AuthorApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthors = async (): Promise<ApiResponse<AuthorListItem[]>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await authorService.getAuthorsAsync();
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

  return { getAuthors, isLoading, error };
};

