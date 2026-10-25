import { isAxiosError } from "axios";

interface ApiErrorData {
  error?: string;
  response?: { message?: string; validation?: { body?: { message?: string } } };
}

export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError<ApiErrorData>(error)) {
    const data = error.response?.data;
    return (
      data?.response?.validation?.body?.message ??
      data?.response?.message ??
      data?.error ??
      error.message
    );
  }
  return "Something went wrong. Please try again.";
};
