import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
// /api
// interceptor, for throwing errors whenever authentication fails, for instance when user credentials or jwt token is been tempered, and then we redirect to the login page

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { status } = error.response;
    switch (status) {
      case 403:
        localStorage.removeItem("user-storage");
        window.location.replace("/login");
        break;
      default:
        break;
    }

    return Promise.reject(error);
  }
);
