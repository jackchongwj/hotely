import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;

// Flag to check if refresh attempt was made
let refreshingToken = false;

axios.interceptors.response.use(
    response => response,
    error => {
        if (!error.response || !error.config) {
            return Promise.reject(error);
        }

        const { status, config } = error.response;

        // Skip refresh logic for specific endpoints
        if (config.url.endsWith('/auth/login') || config.url.endsWith('/auth/register') || config.url.endsWith('/auth/refresh') || config.url.endsWith('/auth/validate')) {
            return Promise.reject(error);
        }

        if (status === 401 && !refreshingToken) {
            refreshingToken = true;  // Indicate a refresh attempt is underway

            return axios.post('/auth/refresh').then(response => {
                const newToken = response.data.accessToken;  // Assume the response includes the new access token
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;  // Update the default token
                config.headers['Authorization'] = `Bearer ${newToken}`;  // Update the token in the failed request
                refreshingToken = false;  // Reset the flag
                return axios(config);  // Retry the original request with the new token
            }).catch(refreshError => {
                refreshingToken = false;  // Reset flag on failure
                window.location = '/login';  // Redirect to login on failure
                return Promise.reject(refreshError);
            });
        }

        return Promise.reject(error);
    }
);




export default axios;
