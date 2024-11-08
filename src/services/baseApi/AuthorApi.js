import axios from "axios";
import { refreshToken } from "../auth";
import Page500 from "../../components/base/Result/Page500";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
});

// Interceptor cho các yêu cầu
axiosClient.interceptors.request.use(
  (config) => {
    // Thêm token vào headers
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho các phản hồi
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    // Nếu token đã hết hạn
    if (response && response.status === 401) {
      try {
        console.log("Refresh token");
        await refreshToken(); // Gọi hàm refreshToken từ AuthApi
        return axiosClient(config); // Thực hiện lại yêu cầu gốc
      } catch (refreshError) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        // Nếu refreshToken cũng thất bại, chuyển hướng đến trang đăng nhập
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }
    return <Page500 />;
  }
);

export default axiosClient;
