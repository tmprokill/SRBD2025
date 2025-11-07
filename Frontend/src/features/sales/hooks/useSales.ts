import { useState } from "react";
import {
  SalesApiService,
  SalesLogApiService,
  SaleDTO,
  SaleResponse,
  SalesLogResponse,
  PagedListResponse,
} from "../services/salesApiService";
import { ApiResponse, ProblemDetails } from "../../../core/api/types";

export const useGetSales = () => {
  const salesService = new SalesApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSales = async (
    readerName?: string,
    bookTitle?: string,
    page: number = 0,
    pageSize: number = 10
  ): Promise<ApiResponse<PagedListResponse<SaleResponse>>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await salesService.getSalesAsync(
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

  return { getSales, isLoading, error };
};

export const useGetSaleDetails = () => {
  const salesService = new SalesApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSaleDetails = async (
    saleId: number
  ): Promise<ApiResponse<SaleResponse>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await salesService.getSaleDetailsAsync(saleId);
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

  return { getSaleDetails, isLoading, error };
};

export const useAddSale = () => {
  const salesService = new SalesApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSale = async (saleDto: SaleDTO): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await salesService.addSaleAsync(saleDto);
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

  return { addSale, isLoading, error };
};

export const useUpdateSale = () => {
  const salesService = new SalesApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSale = async (
    saleId: number,
    saleDto: SaleDTO
  ): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await salesService.updateSaleAsync(saleId, saleDto);
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

  return { updateSale, isLoading, error };
};

export const useDeleteSale = () => {
  const salesService = new SalesApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSale = async (saleId: number): Promise<ApiResponse<void>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await salesService.deleteSaleAsync(saleId);
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

  return { deleteSale, isLoading, error };
};

export const useGetSalesLogs = () => {
  const salesLogService = new SalesLogApiService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSalesLogs = async (
    saleId?: number,
    fromDate?: string,
    toDate?: string,
    page: number = 0,
    pageSize: number = 10
  ): Promise<ApiResponse<SalesLogResponse[]>> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await salesLogService.getLogsAsync(
        saleId,
        fromDate,
        toDate,
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

  return { getSalesLogs, isLoading, error };
};

