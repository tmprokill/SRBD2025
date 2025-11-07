// features/books/services/book-copy-api-service.ts

import { apiRequest } from "../../../core/api/api-request-handler";
import { ApiResponse } from "../../../core/api/types";

export interface BookCopyResponse {
  bookCopyID: number;
  title: string;
  oldPrice: number;
  newPrice: number;
}

export class BookCopyApiService {
  private controller = "/BookCopy";

  async getBookCopiesAsync(): Promise<ApiResponse<BookCopyResponse[]>> {
    const res = await apiRequest<BookCopyResponse[]>({
      method: "get",
      url: this.controller,
    });

    return res;
  }
}

