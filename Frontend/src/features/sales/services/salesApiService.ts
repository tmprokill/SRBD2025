import { apiRequest } from "../../../core/api/api-request-handler";
import { ApiResponse } from "../../../core/api/types";

export interface SaleDTO {
  readerID: number;
  bookID: number;
  saleDate?: string;
  quantity: number;
  price: number;
}

export interface SaleResponse {
  saleID: number;
  readerID: number;
  bookID: number;
  saleDate: string;
  quantity: number;
  price: number;
  reader?: {
    readerID: number;
    fullName: string;
    address: string;
    phone: string;
  };
  book?: {
    bookID: number;
    title: string;
    authorID: number;
    genreID: number;
    price: number;
    quantity: number;
    description?: string;
  };
}

export interface SalesLogResponse {
  id: number;
  saleID: number;
  newQuantity: number;
  newPrice: number;
  modifyDate: string;
}

export interface PagedListResponse<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}

export class SalesApiService {
  private controller = "/Sales";

  async getSalesAsync(
    readerName?: string,
    bookTitle?: string,
    page: number = 0,
    pageSize: number = 10
  ): Promise<ApiResponse<PagedListResponse<SaleResponse>>> {
    const params = new URLSearchParams();
    if (readerName) params.append("readerName", readerName);
    if (bookTitle) params.append("bookTitle", bookTitle);
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    const res = await apiRequest<PagedListResponse<SaleResponse>>({
      method: "get",
      url: `${this.controller}?${params.toString()}`,
    });

    return res;
  }

  async getSaleDetailsAsync(
    saleId: number
  ): Promise<ApiResponse<SaleResponse>> {
    const res = await apiRequest<SaleResponse>({
      method: "get",
      url: `${this.controller}/${saleId}`,
    });

    return res;
  }

  async addSaleAsync(saleDto: SaleDTO): Promise<ApiResponse<void>> {
    const res = await apiRequest<void>({
      method: "post",
      url: this.controller,
      data: saleDto,
    });

    return res;
  }

  async updateSaleAsync(
    saleId: number,
    saleDto: SaleDTO
  ): Promise<ApiResponse<void>> {
    const res = await apiRequest<void>({
      method: "put",
      url: `${this.controller}/${saleId}`,
      data: saleDto,
    });

    return res;
  }

  async deleteSaleAsync(saleId: number): Promise<ApiResponse<void>> {
    const res = await apiRequest<void>({
      method: "delete",
      url: `${this.controller}/${saleId}`,
    });

    return res;
  }
}

export class SalesLogApiService {
  private controller = "/SalesLog";

  async getLogsAsync(
    saleId?: number,
    fromDate?: string,
    toDate?: string,
    page: number = 0,
    pageSize: number = 10
  ): Promise<ApiResponse<SalesLogResponse[]>> {
    const params = new URLSearchParams();
    if (saleId) params.append("saleId", saleId.toString());
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    const res = await apiRequest<SalesLogResponse[]>({
      method: "get",
      url: `${this.controller}?${params.toString()}`,
    });

    return res;
  }
}

