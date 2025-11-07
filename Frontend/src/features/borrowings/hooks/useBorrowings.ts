import { useState } from "react";
import {
  BorrowingApiService,
  BorrowingDTO,
  BorrowingResponse,
  PagedListResponse,
} from "../services/borrowingApiService";
import { ApiResponse, ProblemDetails } from "../../../core/api/types";

export const useGetBorrowings = () => {
  const borrowingService = new BorrowingApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBorrowings = async (
    readerName?: string,
    bookTitle?: string,
    page: number = 0,
    pageSize: number = 10
  ): Promise<ApiResponse<PagedListResponse<BorrowingResponse>>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await borrowingService.getBorrowingsAsync(
        readerName,
        bookTitle,
        page,
        pageSize
      );
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

  return { getBorrowings, isLoading, error };
};

export const useAddBorrowing = () => {
  const borrowingService = new BorrowingApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addBorrowing = async (
    borrowingDto: BorrowingDTO
  ): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await borrowingService.addBorrowingAsync(borrowingDto);
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

  return { addBorrowing, isLoading, error };
};

export const useFinalizeBorrowing = () => {
  const borrowingService = new BorrowingApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finalizeBorrowing = async (
    borrowingId: number
  ): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await borrowingService.finalizeBorrowingAsync(borrowingId);
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

  return { finalizeBorrowing, isLoading, error };
};

