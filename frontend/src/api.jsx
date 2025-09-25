import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            window.dispatchEvent(new CustomEvent('unauthorized'));

        }
        return Promise.reject(error);
    }
);

export default api;
