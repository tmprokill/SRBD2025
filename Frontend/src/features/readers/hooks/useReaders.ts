import { useState } from "react";
import { ReaderApiService, ReaderDTO, ReaderDetailsResponse } from "../services/readerApiService";
import { ApiResponse, ProblemDetails } from "../../../core/api/types";

export const useGetReaders = () => {
  const readerService = new ReaderApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getReaders = async (): Promise<ApiResponse<ReaderDTO[]>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await readerService.getReadersAsync();
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

  return { getReaders, isLoading, error };
};

export const useGetReaderDetails = () => {
  const readerService = new ReaderApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getReaderDetails = async (
    readerId: number
  ): Promise<ApiResponse<ReaderDetailsResponse>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await readerService.getReaderDetailsAsync(readerId);
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

  return { getReaderDetails, isLoading, error };
};

export const useAddReader = () => {
  const readerService = new ReaderApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const addReader = async (
    readerDto: ReaderDTO
  ): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(undefined);

    try {
      const res = await readerService.addReaderAsync(readerDto);
      if (!res.success) {
        setError(res.error?.errors[0].code);
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

  return { addReader, isLoading, error };
};

export const useUpdateReader = () => {
  const readerService = new ReaderApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateReader = async (
    readerId: number,
    readerDto: ReaderDTO
  ): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await readerService.updateReaderAsync(readerId, readerDto);
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

  return { updateReader, isLoading, error };
};

export const useDeleteReader = () => {
  const readerService = new ReaderApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteReader = async (readerId: number): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await readerService.deleteReaderAsync(readerId);
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

  return { deleteReader, isLoading, error };
};

export const useCountReadersFromCity = () => {
  const readerService = new ReaderApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countReadersFromCity = async (
    city: string
  ): Promise<ApiResponse<number>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await readerService.countReadersFromCityAsync(city);
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

  return { countReadersFromCity, isLoading, error };
};