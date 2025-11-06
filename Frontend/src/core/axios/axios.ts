import axios, { AxiosRequestConfig } from "axios";
import { baseUrl } from "../constants";

const config: AxiosRequestConfig = { baseURL: baseUrl, withCredentials: true, };
export const axiosClient = axios.create(config);