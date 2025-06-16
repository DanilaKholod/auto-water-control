import axios, {
    AxiosInstance,
    AxiosResponse,
} from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// axiosInstance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token =
//       typeof window !== "undefined"
//         ? "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mzc1NjU3NDksIngtdXNlcl9pZCI6IjUxYjMyNWJiLWZjMmYtNDcwMy1iOWE2LTNmMTczNDk4MDBmMiJ9.bwZE8PSufakw_4t-t3s5tHVsA8e42WlUolN5PROUmpehcXaMbeyXjIoXSSwwai0nEX8eUqRxaTbMciQeCOzbIqFxowr10X2UZIZT0PZYlR9pW3c4WV_g3AoHrOyFaYV0wKzppxcgGX3Nwhed_tsEYHw6PkV6cq_zoA80zlQBABQdJYmkblYRukw76B1PjYZ_ir_2PvKvn0dfkyNqpF21k01oMSZbG2ITgmH0nLWuIiaYd9uMpYswkdx3uX8OiGIG1CXOZ4wnfXMvSVoSwV-DvSvjBf0r0V4EL-mOabZ8DPoq16yJSWxsgv5T-ELC9HCL2eFSvQRT68_gr0ADmTSVFA"
//         : null;
//     if (token) {
//       config.headers["token"] = `${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      console.error(`API Error: ${error.response.status}`, error.response.data);
    } else {
      console.error("Network Error", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
