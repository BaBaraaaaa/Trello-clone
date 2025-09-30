/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosError } from "axios";
import axiosClient from "./api/axiosClient";

interface AxiosQueryArgs {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  params?: any;
  
}

export const axiosBaseQuery =
  (): BaseQueryFn<AxiosQueryArgs, unknown, unknown> =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosClient({ url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };