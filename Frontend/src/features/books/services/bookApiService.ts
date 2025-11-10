// features/books/services/book-api-service.ts

import { apiRequest } from "../../../core/api/api-request-handler";
import { ApiResponse } from "../../../core/api/types";

export interface BookDTO {
  title: string;
  authorID: number;
  genreID: number;
  price: number;
  quantity: number;
  description?: string;
}

export interface Author {
  authorID: number;
  pseudonym?: string;
  firstName?: string;
  lastName?: string;
}

export interface Genre {
  genreID: number;
  genreName: string;
  description?: string;
}

export interface BookDetailsResponse {
  bookID: number;
  title: string;
  authorID: number;
  genreID: number;
  price: number;
  quantity: number;
  description?: string;
  author?: Author;
  genre?: Genre;
}

export interface BookListItem {
  bookID: number;
  title: string;
  authorID: number;
  genreID: number;
  price: number;
  quantity: number;
  description?: string;
  author?: Author;
  genre?: Genre;
}

export interface SecondPopularBookResponse {
  bookTitle: string;
  totalSold: number;
  authorFullName: string;
}

export class BookApiService {
  private controller = "/Book";

  async getBooksAsync(): Promise<ApiResponse<BookListItem[]>> {
    const res = await apiRequest<BookListItem[]>({
      method: "get",
      url: this.controller,
    });

    return res;
  }

  async getBookDetailsAsync(
    bookId: number
  ): Promise<ApiResponse<BookDetailsResponse>> {
    const res = await apiRequest<BookDetailsResponse>({
      method: "get",
      url: `${this.controller}/${bookId}`,
    });

    return res;
  }

  async addBookAsync(bookDto: BookDTO): Promise<ApiResponse<void>> {
    const res = await apiRequest<void>({
      method: "post",
      url: this.controller,
      data: bookDto,
    });

    return res;
  }

  async updateBookAsync(
    bookId: number,
    bookDto: BookDTO
  ): Promise<ApiResponse<void>> {
    const res = await apiRequest<void>({
      method: "put",
      url: `${this.controller}/${bookId}`,
      data: bookDto,
    });

    return res;
  }

  async deleteBookAsync(bookId: number): Promise<ApiResponse<void>> {
    const res = await apiRequest<void>({
      method: "delete",
      url: `${this.controller}/${bookId}`,
    });

    return res;
  }

  async updateBookDescriptionByPriceAsync(): Promise<ApiResponse<void>> {
    const res = await apiRequest<void>({
      method: "post",
      url: `${this.controller}/update-description-by-price`,
    });

    return res;
  }

  async cutThePriceAsync(
    percent: number,
    minSalesValue: number
  ): Promise<ApiResponse<void>> {
    const res = await apiRequest<void>({
      method: "post",
      url: `${this.controller}/cut-price?percent=${percent}&minSalesValue=${minSalesValue}`,
    });

    return res;
  }

  async countGreaterThanAvgPriceAsync(): Promise<ApiResponse<number>> {
    const res = await apiRequest<number>({
      method: "get",
      url: `${this.controller}/count/greater-than-avg-price`,
    });

    return res;
  }

  async countBooksMorePriceThanAsync(
    price: number
  ): Promise<ApiResponse<number>> {
    const res = await apiRequest<number>({
      method: "get",
      url: `${this.controller}/count/more-price-than/${price}`,
    });

    return res;
  }

  async getSecondPopularBookAsync(
    minTotalSold: number
  ): Promise<ApiResponse<SecondPopularBookResponse[]>> {
    const res = await apiRequest<SecondPopularBookResponse[]>({
      method: "get",
      url: `${this.controller}/second-popular?minTotalSold=${minTotalSold}`,
    });

    return res;
  }
}

