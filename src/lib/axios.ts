import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
    baseURL: 'http://localhost:3100'
});

api.interceptors.request.use((config) => {
    const userStr = Cookies.get('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user && user.id) {
                config.headers['admin-id'] = user.id.toString();
                config.headers['user-role'] = user.role;
            }
        } catch (e) {}
    }
    return config;
});
