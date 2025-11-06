// features/books/services/author-api-service.ts

import { apiRequest } from "../../../core/api/api-request-handler";
import { ApiResponse } from "../../../core/api/types";

export interface AuthorListItem {
  authorID: number;
  pseudonym?: string;
  firstName: string;
  lastName: string;
}

export class AuthorApiService {
  private controller = "/Author";

  async getAuthorsAsync(): Promise<ApiResponse<AuthorListItem[]>> {
    const res = await apiRequest<AuthorListItem[]>({
      method: "get",
      url: this.controller,
    });

    return res;
  }
}

