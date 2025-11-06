import { useState } from "react";
import { GenreApiService, GenreListItem } from "../services/genreApiService";
import { ApiResponse, ProblemDetails } from "../../../core/api/types";

export const useGetGenres = () => {
  const genreService = new GenreApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGenres = async (): Promise<ApiResponse<GenreListItem[]>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await genreService.getGenresAsync();
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

  return { getGenres, isLoading, error };
};

