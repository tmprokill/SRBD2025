import { useState } from "react";
import { AuthApiService } from "../../services/auth-api-service";
import { LoginResponse } from "../types";
import {
    ApiResponse,
    ProblemDetails,
} from "../../../../core/api/types";

export const useGetProfile = () => {
    const authService = new AuthApiService();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getProfile = async (
    ): Promise<ApiResponse<LoginResponse>> => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await authService.getUserProfile();
            if (!res.success) {
                setError(res.message);
            }

            return res;
        } catch (e) {
            const err = e as ProblemDetails;
            setError(err.errors[0].code);
            return {
                success: false,
                message: "",
                data: undefined,
                error: err,
            };
        } finally {
            setIsLoading(false);
        }
    };

    return { getProfile, isLoading, error };
};