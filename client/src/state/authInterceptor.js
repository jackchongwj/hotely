import axios from 'axios';

// Function to obtain a fresh access token
const refreshToken = async () => {
  try {
    const response = await axios.post('/auth/refresh'); // Assumes refresh token is in HTTP-only cookie
    return response.data.accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw new Error('Failed to refresh token');
  }
};

// Response interceptor
axios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark that we have already retried
        try {
          const newAccessToken = await refreshToken();
          axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (_error) {
          // Handle when refresh attempt fails
          console.error("Token refresh failed:", _error);
          return Promise.reject(_error);
        }
      }
      // Reject any other errors or if the token refresh did not work
      return Promise.reject(error);
    }
  );
  
  export default axios;
