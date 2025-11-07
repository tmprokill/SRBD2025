// features/borrowings/services/borrowing-api-service.ts

import { apiRequest } from "../../../core/api/api-request-handler";
import { ApiResponse } from "../../../core/api/types";

export interface BorrowingDTO {
  readerID: number;
  bookID: number;
  quantity: number;
}

export interface BorrowingResponse {
  borrowID: number;
  readerID: number;
  bookID: number;
  borrowDate: string;
  returnDate: string | null;
  quantity: number;
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

export interface PagedListResponse<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}

export class BorrowingApiService {
  private controller = "/Borrowing";

  async getBorrowingsAsync(
    readerName?: string,
    bookTitle?: string,
    page: number = 0,
    pageSize: number = 10
  ): Promise<ApiResponse<PagedListResponse<BorrowingResponse>>> {
    const params = new URLSearchParams();
    if (readerName) params.append("readerName", readerName);
    if (bookTitle) params.append("bookTitle", bookTitle);
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    const res = await apiRequest<PagedListResponse<BorrowingResponse>>({
      method: "get",
      url: `${this.controller}?${params.toString()}`,
    });

    return res;
  }

  async addBorrowingAsync(
    borrowingDto: BorrowingDTO
  ): Promise<ApiResponse<void>> {
    const res = await apiRequest<void>({
      method: "post",
      url: this.controller,
      data: borrowingDto,
    });

    return res;
  }

  async finalizeBorrowingAsync(
    borrowingId: number
  ): Promise<ApiResponse<void>> {
    const res = await apiRequest<void>({
      method: "put",
      url: `${this.controller}/${borrowingId}/finalize`,
    });

    return res;
  }
}

