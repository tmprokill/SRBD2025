// features/books/services/genre-api-service.ts

import { apiRequest } from "../../../core/api/api-request-handler";
import { ApiResponse } from "../../../core/api/types";

export interface GenreListItem {
  genreID: number;
  genreName: string;
  description?: string;
}

export class GenreApiService {
  private controller = "/Genre";

  async getGenresAsync(): Promise<ApiResponse<GenreListItem[]>> {
    const res = await apiRequest<GenreListItem[]>({
      method: "get",
      url: this.controller,
    });

    return res;
  }
}

