import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { ApiErrorResponse, ApiResponse } from "@/types/api";

const DEFAULT_API_URL = "http://localhost:5000/api";

const getBaseUrl = (): string => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
};

/**
 * Centrally configured Axios instance for SyncWatch REST API calls.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/**
 * Normalizes Axios errors into standard ApiErrorResponse structure matching backend contract.
 */
export function normalizeApiError(error: unknown): ApiErrorResponse {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    if (axiosError.response?.data?.error) {
      return axiosError.response.data;
    }
    return {
      success: false,
      error: {
        code: axiosError.code || "NETWORK_ERROR",
        message: axiosError.message || "Failed to communicate with SyncWatch API server.",
      },
    };
  }
  if (error instanceof Error) {
    return {
      success: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: error.message,
      },
    };
  }
  return {
    success: false,
    error: {
      code: "UNKNOWN_ERROR",
      message: "An unexpected error occurred.",
    },
  };
}

/**
 * Generic GET helper function for feature services
 */
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data;
  } catch (error) {
    return normalizeApiError(error);
  }
}

/**
 * Generic POST helper function for feature services
 */
export async function apiPost<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data;
  } catch (error) {
    return normalizeApiError(error);
  }
}
