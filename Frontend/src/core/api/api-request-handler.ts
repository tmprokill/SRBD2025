import { AxiosRequestConfig, AxiosError } from "axios";
import { axiosClient } from "../../core/axios/axios";
import { ApiResponse, ProblemDetails } from "./types";

  export async function apiRequest<T>(
    config: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axiosClient.request<ApiResponse<T>>(config);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (err) {
      const error = err as AxiosError;

      let apiError: ProblemDetails = {
        status: 500,
        title: "Internal Server Error",
        type: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
        detail: "It's over",
        errors: [{ code: "common.application-error", description: "", type: 1 }],
      };

      if (error.response?.data) {
        const data = error.response.data as ProblemDetails;

        // Handle ProblemDetails format
        if (data.title || data.detail) {
          apiError = {
            status: data.status,
            title: data.title,
            type: data.type,
            detail: data.detail,
            errors: data.errors,
          };
        }
      }

      throw apiError;
    }
  }
