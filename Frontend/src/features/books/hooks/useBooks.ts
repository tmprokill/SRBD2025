import { useState } from "react";
import {
  BookApiService,
  BookDTO,
  BookDetailsResponse,
  BookListItem,
  SecondPopularBookResponse,
} from "../services/bookApiService";
import { ApiResponse, ProblemDetails } from "../../../core/api/types";

export const useGetBooks = () => {
  const bookService = new BookApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBooks = async (): Promise<ApiResponse<BookListItem[]>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await bookService.getBooksAsync();
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

  return { getBooks, isLoading, error };
};

export const useGetBookDetails = () => {
  const bookService = new BookApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBookDetails = async (
    bookId: number
  ): Promise<ApiResponse<BookDetailsResponse>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await bookService.getBookDetailsAsync(bookId);
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

  return { getBookDetails, isLoading, error };
};

export const useAddBook = () => {
  const bookService = new BookApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const addBook = async (bookDto: BookDTO): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(undefined);

    try {
      const res = await bookService.addBookAsync(bookDto);
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

  return { addBook, isLoading, error };
};

export const useUpdateBook = () => {
  const bookService = new BookApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBook = async (
    bookId: number,
    bookDto: BookDTO
  ): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await bookService.updateBookAsync(bookId, bookDto);
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

  return { updateBook, isLoading, error };
};

export const useDeleteBook = () => {
  const bookService = new BookApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteBook = async (bookId: number): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await bookService.deleteBookAsync(bookId);
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

  return { deleteBook, isLoading, error };
};

export const useUpdateBookDescriptionByPrice = () => {
  const bookService = new BookApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBookDescriptionByPrice = async (): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await bookService.updateBookDescriptionByPriceAsync();
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

  return { updateBookDescriptionByPrice, isLoading, error };
};

export const useCutThePrice = () => {
  const bookService = new BookApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cutThePrice = async (
    percent: number,
    minSalesValue: number
  ): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await bookService.cutThePriceAsync(percent, minSalesValue);
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

  return { cutThePrice, isLoading, error };
};

export const useCountGreaterThanAvgPrice = () => {
  const bookService = new BookApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countGreaterThanAvgPrice = async (): Promise<ApiResponse<number>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await bookService.countGreaterThanAvgPriceAsync();
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

  return { countGreaterThanAvgPrice, isLoading, error };
};

export const useCountBooksMorePriceThan = () => {
  const bookService = new BookApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countBooksMorePriceThan = async (
    price: number
  ): Promise<ApiResponse<number>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await bookService.countBooksMorePriceThanAsync(price);
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

  return { countBooksMorePriceThan, isLoading, error };
};

export const useGetSecondPopularBook = () => {
  const bookService = new BookApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSecondPopularBook = async (
    minTotalSold: number
  ): Promise<ApiResponse<SecondPopularBookResponse>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await bookService.getSecondPopularBookAsync(minTotalSold);
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

  return { getSecondPopularBook, isLoading, error };
}

