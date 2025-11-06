// features/readers/services/reader-api-service.ts

import { apiRequest } from "../../../core/api/api-request-handler";
import { ApiResponse } from "../../../core/api/types";

export interface ReaderDTO {
  readerID?: number;
  fullName: string;
  phone: string;
  address: string;
}

export interface ReaderDetailsResponse extends ReaderDTO {
  readerID: number;
  registrationDate?: string;
  borrowedBooksCount?: number;
}

export class ReaderApiService {
  private controller = "/Reader";

  async getReadersAsync(): Promise<ApiResponse<ReaderDTO[]>> {
    const res = await apiRequest<ReaderDTO[]>({
      method: "get",
      url: this.controller,
    });

    return res;
  }

  async getReaderDetailsAsync(
    readerId: number
  ): Promise<ApiResponse<ReaderDetailsResponse>> {
    const res = await apiRequest<ReaderDetailsResponse>({
      method: "get",
      url: `${this.controller}/${readerId}`,
    });

    return res;
  }

  async addReaderAsync(
    readerDto: ReaderDTO
  ): Promise<ApiResponse<void>> {
    const res = await apiRequest<void>({
      method: "post",
      url: this.controller,
      data: readerDto,
    });

    return res;
  }

  async updateReaderAsync(
    readerId: number,
    readerDto: ReaderDTO
  ): Promise<ApiResponse<void>> {
    const res = await apiRequest<void>({
      method: "put",
      url: `${this.controller}/${readerId}`,
      data: readerDto,
    });

    return res;
  }

  async deleteReaderAsync(readerId: number): Promise<ApiResponse<void>> {
    const res = await apiRequest<void>({
      method: "delete",
      url: `${this.controller}/${readerId}`,
    });

    return res;
  }

  async countReadersFromCityAsync(
    city: string
  ): Promise<ApiResponse<number>> {
    const res = await apiRequest<number>({
      method: "get",
      url: `${this.controller}/count/city/${encodeURIComponent(city)}`,
    });

    return res;
  }
}